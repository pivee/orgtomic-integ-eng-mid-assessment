import { PrismaService } from '@modules/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';

describe('JobsService', () => {
  let service: JobsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

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
            },
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have create defined', () => {
    expect(service.create).toBeDefined();
  });

  it('should have findAll defined', () => {
    expect(service.findAll).toBeDefined();
  });

  it('should have findOne defined', () => {
    expect(service.findOne).toBeDefined();
  });

  it('should have update defined', () => {
    expect(service.update).toBeDefined();
  });

  it('should have remove defined', () => {
    expect(service.remove).toBeDefined();
  });
});
