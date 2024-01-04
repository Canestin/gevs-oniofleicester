import { AppRole } from '../../shared/interfaces/auth.interface';
import { Constituency } from '../../constituency/entities/constituency.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Voter extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ type: 'date' })
  DOB: Date;

  @Column()
  password: string;

  @Column({ type: 'char', length: 8 })
  UVC: string;

  @ManyToOne(() => Constituency, (c) => c.voters, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'constituency_id' })
  constituency: Constituency;

  @Column({ type: 'boolean', default: false })
  has_voted: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  /** used by nest-access-control */
  get roles() {
    return AppRole.VOTER;
  }
}
