import { Candidate } from '../../candidate/entities/candidate.entity';
import { Voter } from '../../voter/entities/voter.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Constituency {
  @PrimaryColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Voter, (n) => n.constituency)
  voters: Voter[];

  @OneToMany(() => Candidate, (n) => n.constituency, { eager: true })
  candidates: Candidate[];
}
