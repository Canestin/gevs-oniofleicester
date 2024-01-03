import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
const admins = require('./data/sellers.json');
import * as bcrypt from 'bcrypt';
import { Admin } from '../gevs/entities/admin.entity';
import { SALT_ROUNDS } from '../shared/services/encryption.service';

export default class CreateAdmin implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const adminsWithEncryptedPasswords = await Promise.all(
      admins.map(async (admin) => ({
        ...admin,
        password: await bcrypt.hash(admin.password, SALT_ROUNDS),
      })),
    );

    await connection
      .createQueryBuilder()
      .insert()
      .into(Admin)
      .values(adminsWithEncryptedPasswords)
      .execute();
  }
}
