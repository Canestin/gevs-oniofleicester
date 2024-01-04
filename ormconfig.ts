import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Candidate } from './src/candidate/entities/candidate.entity';
import { Constituency } from './src/constituency/entities/constituency.entity';
import { Party } from './src/party/entities/party.entity';
import { UvcCode } from './src/voter/entities/uvc_code.entity';
import { Voter } from './src/voter/entities/voter.entity';
import { Status } from './src/gevs/entities/status.entity';
import { Admin } from './src/gevs/entities/admin.entity';
import { RevokedRefreshToken } from './src/auth/revoked-refresh-token.entity';
dotenv.config();

// Check typeORM documentation for more information.
// https://typeorm.io/data-source-options#data-source-options
const config: TypeOrmModuleOptions & { seeds?: string[] } = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Voter,
    Constituency,
    Candidate,
    Party,
    UvcCode,
    Status,
    Admin,
    RevokedRefreshToken,
  ],

  // To use migrations, synchronize should be set to false.
  synchronize: !!parseInt(process.env.TYPEORM_SYNCHRONIZE),

  // Typeorm logs
  logging: !!parseInt(process.env.TYPEORM_LOGGING),

  // Seed folder
  seeds: [__dirname + '/./src/seeds/*{.ts,.js}'],
};

export = config;
