import { DataResponse } from '@core/data-response/data-response';
import { PaginationOptions } from '@core/pagination-options/pagination-options';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IndeedXmlInterceptor } from 'src/middleware/indeed-xml.interceptor';
import { CreateJobDto } from './dto/create-job.dto';
import { FindAllJobsDto } from './dto/find-all-jobs.dto';
import { FindJobDto } from './dto/find-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
@ApiTags('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a new job posting with an expiration date set by default for 30 days.',
  })
  @ApiOkResponse({ type: FindJobDto })
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all active (non-expired) jobs with pagination',
  })
  @ApiOkResponse({ type: FindAllJobsDto })
  @ApiQuery({
    name: 'take',
    type: 'number',
    required: false,
    description: 'Default = 10',
  })
  @ApiQuery({
    name: 'skip',
    type: 'number',
    required: false,
    description: 'Default = 0',
  })
  async findAll(
    @Query(
      'take',
      new DefaultValuePipe(new PaginationOptions().take),
      ParseIntPipe,
    )
    take: number,
    @Query(
      'skip',
      new DefaultValuePipe(new PaginationOptions().skip),
      ParseIntPipe,
    )
    skip: number,
  ) {
    const { result, metadata } = await this.jobsService.findAll(undefined, {
      take,
      skip,
    });

    return new DataResponse(result, metadata);
  }

  @Get('/indeed.xml')
  @UseInterceptors(IndeedXmlInterceptor)
  @ApiProduces('application/xml')
  @ApiOkResponse({ type: FindJobDto })
  async findAllForIndeed() {
    const jobs = await this.jobsService.findAllWithoutPagination({});
    return jobs;
  }

  @Get(':id')
  @ApiOkResponse({ type: FindJobDto })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: FindJobDto })
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
