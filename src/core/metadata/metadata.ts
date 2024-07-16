import { ApiProperty } from '@nestjs/swagger';

export class Metadata<T> {
  @ApiProperty({ required: false })
  count?: number;

  constructor(data: T) {
    if (Array.isArray(data)) this.count = data.length;
  }
}
