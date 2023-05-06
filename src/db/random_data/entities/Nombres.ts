import { Column, Entity } from "typeorm";

@Entity("nombres", { schema: "dbo" })
export class Nombres {
  @Column("varchar", { name: "nombre", nullable: true, length: 200 })
  nombre: string | null;
}
