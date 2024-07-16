import { PrismaService } from '@modules/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

describe('JobsController', () => {
  let controller: JobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        JobsService,
        {
          provide: PrismaService,
          useValue: {
            job: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have create defined', () => {
    expect(controller.create).toBeDefined();
  });

  it('should have findAll defined', () => {
    expect(controller.findAll).toBeDefined();
  });

  it('should have findOne defined', () => {
    expect(controller.findOne).toBeDefined();
  });

  it('should have update defined', () => {
    expect(controller.update).toBeDefined();
  });

  it('should have remove defined', () => {
    expect(controller.remove).toBeDefined();
  });
});
