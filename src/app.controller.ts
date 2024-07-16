import { DataResponse } from '@core/data-response/data-response';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): DataResponse<string> {
    const data = this.appService.getHello();
    return new DataResponse(data);
  }
}
