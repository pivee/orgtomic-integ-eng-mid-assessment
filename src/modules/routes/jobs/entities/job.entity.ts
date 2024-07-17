import { ApiProperty } from '@nestjs/swagger';
import { JobType, Prisma, RemoteType } from '@prisma/client';

export class JobEntity implements Prisma.JobCreateWithoutJobAdvertsInput {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  referenceNumber: number;

  @ApiProperty()
  requisitionId: string;

  @ApiProperty()
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

  @ApiProperty()
  jobType: JobType;

  @ApiProperty()
  category?: string;

  @ApiProperty()
  experience: string;

  @ApiProperty()
  publishedDate: Date | string;

  @ApiProperty()
  expirationDate: Date | string;

  @ApiProperty()
  remoteType: RemoteType;

  @ApiProperty()
  lastActivityDate?: Date;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
