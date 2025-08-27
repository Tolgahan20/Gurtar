import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty()
  data: T;

  @ApiProperty()
  meta: {
    timestamp: string;
    path: string;
    duration: number;
  };
}
