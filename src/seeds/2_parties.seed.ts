import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Party } from '../party/entities/party.entity';
const parties = require('./data/parties.json');

export default class CreateParties implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Party)
      .values(parties)
      .execute();
  }
}
