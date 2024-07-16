export class PrismaServiceMock {
  job = {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirstOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}
