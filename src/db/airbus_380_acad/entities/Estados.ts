import { Column, Entity, Index, OneToMany } from "typeorm";
import { Municipios } from "./Municipios";

@Index("pk_estados", ["cveEstados"], { unique: true })
@Entity("estados", { schema: "dbo" })
export class Estados {
  @Column("int", { primary: true, name: "cve_estados" })
  cveEstados: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 50 })
  nombre: string | null;

  @Column("varchar", { name: "paterno", nullable: true, length: 50 })
  paterno: string | null;

  @OneToMany(() => Municipios, (municipios) => municipios.cveEstados2)
  municipios: Municipios[];
}
