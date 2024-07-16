import { DataResponse } from '@core/data-response/data-response';
import { JobEntity } from '../entities/job.entity';

export class FindAllJobsDto extends DataResponse<JobEntity[]> {}
