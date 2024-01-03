import { StatusType } from '../../shared/interfaces/result.interface';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Status {
  @PrimaryColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StatusType,
    nullable: false,
    default: 'Pending',
  })
  status: StatusType;
}
