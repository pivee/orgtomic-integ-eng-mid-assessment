import { PrismaService } from '@modules/prisma/prisma.service';
import { PrismaServiceMock } from '@modules/prisma/prisma.service.mock';
import { Test } from '@nestjs/testing';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

describe('JobsService', () => {
  let jobsService: JobsService;
  let prismaServiceMock: PrismaServiceMock;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useClass: PrismaServiceMock },
      ],
    }).compile();

    jobsService = moduleRef.get<JobsService>(JobsService);
    prismaServiceMock = moduleRef.get<PrismaService>(PrismaService) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a job', async () => {
      const createJobDto: Partial<CreateJobDto> = {
        title: 'Test Job',
        description: 'This is a test job',
        expirationDate: new Date(),
      };

      const expectedResult = { id: 1, ...createJobDto };
      prismaServiceMock.job.create.mockResolvedValue(expectedResult);

      const result = await jobsService.create(createJobDto as CreateJobDto);

      expect(result).toEqual(expectedResult);
      expect(prismaServiceMock.job.create).toHaveBeenCalledWith({
        data: createJobDto,
      });
    });

    it('should set default expiration date if not provided', async () => {
      const createJobDto: Partial<CreateJobDto> = {
        title: 'Test Job',
        description: 'This is a test job',
      };

      const expectedResult = { id: 1, ...createJobDto };
      prismaServiceMock.job.create.mockResolvedValue(expectedResult);

      const result = await jobsService.create(createJobDto as CreateJobDto);

      expect(result).toEqual(expectedResult);
      expect(prismaServiceMock.job.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...createJobDto,
          expirationDate: expect.any(Date),
        }),
      });
    });
  });

  describe('findAll', () => {
    it('should find all jobs', async () => {
      const expectedResult = [{ id: 1, title: 'Test Job' }];
      prismaServiceMock.job.findMany.mockResolvedValue(expectedResult);

      const result = await jobsService.findAll();

      expect(result).toEqual(expectedResult);
      expect(prismaServiceMock.job.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find one job by id', async () => {
      const jobId = 1;
      const expectedResult = { id: jobId, title: 'Test Job' };
      prismaServiceMock.job.findFirstOrThrow.mockResolvedValue(expectedResult);

      const result = await jobsService.findOne(jobId);

      expect(result).toEqual(expectedResult);
      expect(prismaServiceMock.job.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: jobId },
      });
    });
  });

  describe('update', () => {
    it('should update a job', async () => {
      const jobId = 1;
      const updateJobDto: UpdateJobDto = {
        title: 'Updated Test Job',
      };

      const expectedResult = { id: jobId, ...updateJobDto };
      prismaServiceMock.job.update.mockResolvedValue(expectedResult);

      const result = await jobsService.update(jobId, updateJobDto);

      expect(result).toEqual(expectedResult);
      expect(prismaServiceMock.job.update).toHaveBeenCalledWith({
        data: updateJobDto,
        where: { id: jobId },
      });
    });
  });

  describe('remove', () => {
    it('should remove a job by id', async () => {
      const jobId = 1;
      const deleteResult = { count: 1 };
      prismaServiceMock.job.delete.mockResolvedValue(deleteResult);

      const result = await jobsService.remove(jobId);

      expect(result).toEqual(deleteResult);
      expect(prismaServiceMock.job.delete).toHaveBeenCalledWith({
        where: { id: jobId },
      });
    });
  });
});
