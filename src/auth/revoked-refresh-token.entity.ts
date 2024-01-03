import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RevokedRefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  revokedRefreshToken: string;

  @CreateDateColumn()
  createdDate: Date;
}
