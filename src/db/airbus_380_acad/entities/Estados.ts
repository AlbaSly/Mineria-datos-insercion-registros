import { Column, Entity, Index, OneToMany } from "typeorm";
import { Municipios } from "./Municipios";

@Index("pk_estados", ["cveEstado"], { unique: true })
@Entity("estados", { schema: "dbo" })
export class Estados {
  @Column("int", { primary: true, name: "cve_estado" })
  cveEstado: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 50 })
  nombre: string | null;

  @Column("varchar", { name: "abreviatura", nullable: true, length: 50 })
  abreviatura: string | null;

  @OneToMany(() => Municipios, (municipios) => municipios.cveEstados2)
  municipios: Municipios[];
}
