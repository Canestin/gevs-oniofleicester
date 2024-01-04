import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { UvcCode } from '../voter/entities/uvc_code.entity';
const uvc_codes = require('./data/uvc_codes.json');

export default class CreateUvcCodes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(UvcCode)
      .values(uvc_codes)
      .execute();
  }
}
