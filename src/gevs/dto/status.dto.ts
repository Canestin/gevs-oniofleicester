import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { StatusType } from '../../shared/interfaces/result.interface';

export class StatusDto {
  @IsEnum(StatusType)
  @ApiProperty({
    description: 'The status type of the elections',
    enum: StatusType,
  })
  status: StatusType;
}
