import {
  IsDefined,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Users roles
 */
export enum AppRole {
  ADMIN = 'admin',
  VOTER = 'voter',
}

/** Request body used to create a new jwt */
export class CreateJwtRequest {
  @IsEmail()
  @IsDefined()
  @ApiProperty({
    description: 'Email of an existing user',
    example: 'admin.tech@GEVS.africa',
  })
  email: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({
    description: 'Password of an existing user',
    example: 'AdminTech',
  })
  password: string;
}

/** Response body after a successful authentication */
export class CreateJwtResponse {
  @ApiProperty({
    externalDocs: {
      url: 'https://tools.ietf.org/html/rfc7519',
      description: 'RFC 7519',
    },
    description:
      'Signed access token JWT. Carries the necessary information to access API ressources directly. Short lived.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDUxMWY0Ny1kYzU4LTQwMmYtYWM3Yy01ZjliZTc0NzhjNmMiLCJpYXQiOjE2MDczMDM2NzUsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYwNzMwMzczNX0.B3v7UBxkgwjhIBrqNOH-j1ACULJ0SVMQTkeRQQ_losA',
  })
  accessToken: string;

  @ApiProperty({
    description:
      'Signed refresh token JWT. Carries the information necessary to get a new access token. Long-lived',
    externalDocs: {
      url: 'https://tools.ietf.org/html/rfc7519',
      description: 'RFC 7519',
    },
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDUxMWY0Ny1kYzU4LTQwMmYtYWM3Yy01ZjliZTc0NzhjNmMiLCJpYXQiOjE2MDczMDM2NzUsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYwNzMwMzczNX0.B3v7UBxkgwjhIBrqNOH-j1ACULJ0SVMQTkeRQQ_losA',
  })
  refreshToken: string;
}

/** Response body after a successful authentication */
export class RefreshJwtResponse {
  @ApiProperty({
    description:
      'Signed access token JWT. Carries the necessary information to access API ressources directly. Short lived.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDUxMWY0Ny1kYzU4LTQwMmYtYWM3Yy01ZjliZTc0NzhjNmMiLCJpYXQiOjE2MDczMDM2NzUsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYwNzMwMzczNX0.B3v7UBxkgwjhIBrqNOH-j1ACULJ0SVMQTkeRQQ_losA',
  })
  accessToken: string;
}

/**
 * The JWT payload
 * @see https://tools.ietf.org/html/rfc7519 | RFC7519
 */
export class JsonWebToken {
  /** (subject): Subject of the JWT (the user) */
  sub: string;

  /** (expiration time): Time after which the JWT expires */
  exp: number;

  /** (issued at time): Time at which the JWT was issued; can be used to determine age of the JWT */
  iat: number;

  /** User role */
  role: AppRole;
}

/** Request body used to create a new jwt */
export class RefreshJwtRequest {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'A refresh JWT',
    externalDocs: {
      url: 'https://tools.ietf.org/html/rfc7519',
      description: 'RFC 7519',
    },
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDUxMWY0Ny1kYzU4LTQwMmYtYWM3Yy01ZjliZTc0NzhjNmMiLCJpYXQiOjE2MDY2OTY2MDYsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYwNzMwMTQwNn0.hZettP2Iz6vTz62yaRyxYvw1llmRq8usOMJz5u--mf4',
  })
  refreshToken: string;
}

export class SuccessResponse {
  @IsIn([200, 201, 202])
  @ApiProperty({
    description: 'Request status code, in this case 200',
    example: 200,
  })
  statusCode: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Request success message',
    example: 'Password updated successfully',
  })
  message: string;
}
