import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn({unique: true})
  public id: string;
  @Column({unique: true})
  public username: string;
}
