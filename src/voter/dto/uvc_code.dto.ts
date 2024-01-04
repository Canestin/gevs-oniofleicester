import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, Length } from 'class-validator';

export class UvcCodeDto {
  @Length(8)
  @IsNumber()
  @ApiProperty({
    description: 'UVC Code',
    example: 1,
  })
  UVC: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Informs if the code has already been used',
    example: true,
  })
  used: boolean;
}
