import { Column, Entity } from "typeorm";

@Entity("apellidos", { schema: "dbo" })
export class Apellidos {
  @Column("varchar", { name: "apellido", nullable: true, length: 200 })
  apellido: string | null;
}
