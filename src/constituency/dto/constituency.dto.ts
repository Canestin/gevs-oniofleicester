import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ConstituencyDto {
  @IsNumber()
  @ApiProperty({
    description: 'The ID of the constituency',
    example: 1,
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: 'The name of the constituency',
    example: 'Shangri-la-Town',
  })
  name: string;
}
