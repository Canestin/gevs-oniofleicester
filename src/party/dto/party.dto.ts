import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PartyDto {
  @IsNumber()
  @ApiProperty({
    description: 'The ID of the party',
    example: 1,
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: 'The name of the party',
    example: 'Blue Party',
  })
  name: string;
}
