import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UvcCode {
  @PrimaryColumn({ type: 'char', length: 8 })
  UVC: string;

  @Column({ type: 'boolean', default: false })
  used: boolean;
}
