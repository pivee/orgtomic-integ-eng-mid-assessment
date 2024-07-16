import { DataResponse } from '@core/data-response/data-response';
import { Metadata } from '@core/metadata/metadata';
import { ApiProperty } from '@nestjs/swagger';
import { JobEntity } from '../entities/job.entity';

export class FindJobDto extends DataResponse<JobEntity> {
  @ApiProperty({ type: JobEntity })
  public result: JobEntity;

  @ApiProperty({ type: Metadata })
  public meta: any;
}
