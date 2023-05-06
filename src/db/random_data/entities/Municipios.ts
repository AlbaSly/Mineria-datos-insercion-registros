import { Column, Entity } from "typeorm";

@Entity("municipios", { schema: "dbo" })
export class Municipios {
  @Column("int", { name: "cve_municipios" })
  cveMunicipios: number;

  @Column("int", { name: "cve_estados" })
  cveEstados: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 40 })
  nombre: string | null;
}
