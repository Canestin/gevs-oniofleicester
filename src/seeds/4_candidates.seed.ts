import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Candidate } from '../candidate/entities/candidate.entity';
const candidates = require('./data/candidates.json');

export default class CreateCandidates implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Candidate)
      .values(candidates)
      .execute();
  }
}
