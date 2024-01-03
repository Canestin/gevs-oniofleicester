import { Constituency } from '../../constituency/entities/constituency.entity';
import { Party } from '../../party/entities/party.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Party, (c) => c.candidates, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'party_id' })
  party: Party;

  @ManyToOne(() => Constituency, (c) => c.candidates, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'constituency_id' })
  constituency: Constituency;

  @Column({ type: 'int', default: 0 })
  vote_count: number;
}
