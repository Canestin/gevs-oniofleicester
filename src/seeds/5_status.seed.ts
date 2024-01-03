import { Status } from '../gevs/entities/status.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
const status = require('./data/status.json');

export default class CreateGevStatus implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Status)
      .values(status)
      .execute();
  }
}
