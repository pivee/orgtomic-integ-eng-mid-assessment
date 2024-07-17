import { PaginationOptions } from '@core/pagination-options/pagination-options';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Job, JobType, Prisma, RemoteType } from '@prisma/client';
import * as dayjs from 'dayjs';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

describe('JobsService', () => {
  let service: JobsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: PrismaService,
          useValue: {
            job: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirstOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a job with a default expiration date if none is provided', async () => {
      const createJobDto: CreateJobDto = {
        title: 'Test Job',
        referenceNumber: 12345,
        requisitionId: 'REQ123',
        apiJobId: 'API123',
        url: 'https://example.com',
        trackingUrl: 'https://example.com/track',
        company: 'Test Company',
        sourceName: 'Test Source',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        postalCode: '12345',
        streetAddress: '123 Test St',
        email: 'test@example.com',
        description: 'Test Description',
        salary: '100k',
        education: "Bachelor's Degree",
        jobType: JobType.FULL_TIME,
        category: 'Engineering',
        experience: '2 years',
        publishedDate: dayjs().format('YYYY-MM-DD'),
        expirationDate: undefined,
        remoteType: RemoteType.FULLY_REMOTE,
      };
      const expectedExpirationDate = dayjs()
        .add(30, 'days')
        .format('YYYY-MM-DD');
      const job = { ...createJobDto, expirationDate: expectedExpirationDate };

      jest
        .spyOn(prismaService.job, 'create')
        .mockResolvedValue(job as unknown as Job);

      const result = await service.create(createJobDto);

      expect(prismaService.job.create).toHaveBeenCalledWith({
        data: { ...createJobDto, expirationDate: expectedExpirationDate },
      });
      expect(result).toEqual(job);
    });

    it('should create a job with the provided expiration date', async () => {
      const createJobDto: CreateJobDto = {
        title: 'Test Job',
        referenceNumber: 12345,
        requisitionId: 'REQ123',
        apiJobId: 'API123',
        url: 'https://example.com',
        trackingUrl: 'https://example.com/track',
        company: 'Test Company',
        sourceName: 'Test Source',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        postalCode: '12345',
        streetAddress: '123 Test St',
        email: 'test@example.com',
        description: 'Test Description',
        salary: '100k',
        education: "Bachelor's Degree",
        jobType: JobType.FULL_TIME,
        category: 'Engineering',
        experience: '2 years',
        publishedDate: dayjs().format('YYYY-MM-DD'),
        expirationDate: dayjs().format('YYYY-MM-DD'),
        remoteType: RemoteType.FULLY_REMOTE,
      };
      const job = { ...createJobDto };

      jest.spyOn(prismaService.job, 'create').mockResolvedValue(job as Job);

      const result = await service.create(createJobDto);

      expect(prismaService.job.create).toHaveBeenCalledWith({
        data: createJobDto,
      });
      expect(result).toEqual(job);
    });
  });

  describe('findAll', () => {
    it('should find all jobs with pagination and metadata', async () => {
      const where: Prisma.JobWhereInput = { title: { contains: 'Test' } };
      const options: PaginationOptions = new PaginationOptions(10, 0);
      const jobs = [
        {
          id: 1,
          title: 'Test Job',
          description: 'Test Description',
          expirationDate: dayjs().add(30, 'days').format('YYYY-MM-DD'),
        },
      ];
      const totalCount = 1;

      jest.spyOn(prismaService.job, 'count').mockResolvedValue(totalCount);
      jest
        .spyOn(prismaService.job, 'findMany')
        .mockResolvedValue(jobs as unknown as Job[]);

      const result = await service.findAll(where, options);

      expect(prismaService.job.count).toHaveBeenCalledWith({
        where: {
          ...where,
          expirationDate: { gt: dayjs().format('YYYY-MM-DD') },
        },
      });
      expect(prismaService.job.findMany).toHaveBeenCalledWith({
        where: {
          ...where,
          expirationDate: { gt: dayjs().format('YYYY-MM-DD') },
        },
        take: options.take,
        skip: options.skip,
      });

      expect(result).toEqual({
        result: jobs,
        metadata: expect.objectContaining({
          totalCount,
          take: options.take,
          skip: options.skip,
          pageCount: 1,
          currentPage: 1,
        }),
      });
    });
  });

  describe('findOne', () => {
    it('should find a job by id', async () => {
      const job = {
        id: 1,
        title: 'Test Job',
        description: 'Test Description',
        expirationDate: dayjs().format('YYYY-MM-DD'),
      };

      jest
        .spyOn(prismaService.job, 'findFirstOrThrow')
        .mockResolvedValue(job as unknown as Job);

      const result = await service.findOne(1);

      expect(prismaService.job.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(job);
    });
  });

  describe('update', () => {
    it('should update a job by id', async () => {
      const updateJobDto: UpdateJobDto = { title: 'Updated Job' };
      const job = {
        id: 1,
        ...updateJobDto,
        description: 'Test Description',
        expirationDate: dayjs().format('YYYY-MM-DD'),
      };

      jest
        .spyOn(prismaService.job, 'update')
        .mockResolvedValue(job as unknown as Job);

      const result = await service.update(1, updateJobDto);

      expect(prismaService.job.update).toHaveBeenCalledWith({
        data: updateJobDto,
        where: { id: 1 },
      });
      expect(result).toEqual(job);
    });
  });

  describe('remove', () => {
    it('should remove a job by id', async () => {
      const job = {
        id: 1,
        title: 'Test Job',
        description: 'Test Description',
        expirationDate: dayjs().format('YYYY-MM-DD'),
      };

      jest
        .spyOn(prismaService.job, 'delete')
        .mockResolvedValue(job as unknown as Job);

      const result = await service.remove(1);

      expect(prismaService.job.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(job);
    });
  });
});
