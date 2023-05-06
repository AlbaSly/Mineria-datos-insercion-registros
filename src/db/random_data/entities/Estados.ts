import { Column, Entity } from "typeorm";

@Entity("estados", { schema: "dbo" })
export class Estados {
  @Column("int", { name: "cve_estado" })
  cveEstado: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 60 })
  nombre: string | null;

  @Column("varchar", { name: "abreviatura", nullable: true, length: 20 })
  abreviatura: string | null;
}
