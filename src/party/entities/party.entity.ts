import { Candidate } from '../../candidate/entities/candidate.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Party {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Candidate, (n) => n.party)
  candidates: Candidate[];
}
