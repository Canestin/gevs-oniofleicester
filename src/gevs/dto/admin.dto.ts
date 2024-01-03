import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the admin',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The password of the admin',
    example: 'Password',
  })
  password: string;
}
