import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ToVoteDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The ID of the candidate',
    example: 1,
  })
  candidateId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The ID of the voter',
    example: 2,
  })
  voterId: number;
}
