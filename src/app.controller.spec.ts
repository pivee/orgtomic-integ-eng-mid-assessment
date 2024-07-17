import { DataResponse } from '@core/data-response/data-response';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBeInstanceOf(DataResponse);
      expect(appController.getHello()).toEqual(
        expect.objectContaining({
          result: expect.any(String),
        }),
      );
    });
  });
});
