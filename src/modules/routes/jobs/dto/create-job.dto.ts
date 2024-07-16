import { ApiProperty } from '@nestjs/swagger';
import { JobType, RemoteType } from '@prisma/client';
import * as dayjs from 'dayjs';
import { JobEntity } from '../entities/job.entity';

export class CreateJobDto implements Partial<JobEntity> {
  @ApiProperty()
  title: string;

  @ApiProperty()
  referenceNumber: number;

  @ApiProperty()
  requisitionId: string;

  @ApiProperty({ required: false })
  apiJobId?: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  trackingUrl: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  sourceName: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  streetAddress: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  salary: string;

  @ApiProperty()
  education: string;

  @ApiProperty({ enum: JobType })
  jobType: JobType;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty()
  experience: string;

  @ApiProperty()
  publishedDate: Date;

  @ApiProperty()
  expirationDate: Date;

  @ApiProperty({ enum: RemoteType })
  remoteType: RemoteType;

  validate() {
    if (!this.expirationDate) {
      this.expirationDate = dayjs().add(30, 'days').toDate();
    }
    return this;
  }
}
