import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConstituencyDto } from '../../constituency/dto/constituency.dto';

export class CreateVoterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The fullName of the voter',
    example: 'Jane Doe',
  })
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the voter',
    example: 'jane.doe@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The password of the voter',
    example: 'Password',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "The voter's UVC Code",
    example: 'HH64FWPE',
  })
  UVC: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: "The voter's date of birth",
    example: '01/01/2000',
  })
  DOB: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The constituency ID of the voter',
    example: 1,
  })
  constituency_id: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The constituency of the voter',
    example: { id: 1, name: 'Shangri-la-Town' },
  })
  constituency?: ConstituencyDto;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Informs if the voter has already been voted',
    example: false,
  })
  has_voted: boolean;
}
