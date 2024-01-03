import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Constituency } from '../constituency/entities/constituency.entity';
const constituencies = require('./data/constituencies.json');

export default class CreateConstituencies implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Constituency)
      .values(constituencies)
      .execute();
  }
}
