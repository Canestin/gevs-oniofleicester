import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CandidateDto {
  @IsString()
  @ApiProperty({
    description: 'The fullName of the candidate',
    example: 'Jane Doe',
  })
  name: string;

  @IsNumber()
  @ApiProperty({
    description: 'The party ID of the candidate',
  })
  party_id: number;

  @IsNumber()
  @ApiProperty({
    description: 'The constituency ID of the candidate',
  })
  constituency_id: number;
}
