import { AppRole } from '../../shared/interfaces/auth.interface';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class Admin extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  /** Number of updates on the object */
  @VersionColumn()
  version: number;

  /** used by nest-access-control */
  get roles() {
    return AppRole.ADMIN;
  }
}
