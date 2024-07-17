import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Prisma } from '@prisma/client';
import { PaginationOptions } from '@core/pagination-options/pagination-options';
import { Metadata } from '@core/metadata/metadata';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    if (!createJobDto.expirationDate) {
      createJobDto.expirationDate = dayjs().add(30, 'days').toDate();
    }

    const result = await this.prisma.job.create({
      data: createJobDto,
    });

    return result;
  }

  async findAll(where: Prisma.JobWhereInput, options: PaginationOptions) {
    where = { ...where, expirationDate: { gt: dayjs().format('YYYY-MM-DD') } };

    const totalCount = await this.prisma.job.count({
      where,
    });

    const result = await this.prisma.job.findMany({
      where,
      take: options.take,
      skip: options.skip,
    });

    const metadata = new Metadata(result, { ...options, totalCount });

    return { result, metadata };
  }

  async findOne(id: number) {
    const result = await this.prisma.job.findFirstOrThrow({ where: { id } });

    return result;
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const result = await this.prisma.job.update({
      data: updateJobDto,
      where: { id },
    });

    return result;
  }

  async remove(id: number) {
    return await this.prisma.job.delete({ where: { id } });
  }
}
