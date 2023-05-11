import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Municipios } from "./Municipios";
import { Ocupaciones } from "./Ocupaciones";

@Index("pk_clientes", ["cveClientes"], { unique: true })
@Entity("clientes", { schema: "dbo" })
export class Clientes {
  @Column("int", { primary: true, name: "cve_clientes" })
  cveClientes: number;

  @Column("int", {name: "cve_estados"})
  cveEstados: number;

  @Column("int", {name: "cve_municipios"})
  cveMunicipios: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 50 })
  nombre: string | null;

  @Column("varchar", { name: "paterno", nullable: true, length: 50 })
  paterno: string | null;

  @Column("varchar", { name: "materno", nullable: true, length: 50 })
  materno: string | null;

  @Column("datetime", { name: "fecha_nacimiento", nullable: true })
  fechaNacimiento: Date | null;

  @ManyToOne(() => Municipios, (municipios) => municipios.clientes)
  @JoinColumn([
    { name: "cve_municipios", referencedColumnName: "cveMunicipios" },
    { name: "cve_estados", referencedColumnName: "cveEstados" },
  ])
  municipios: Municipios;

  @OneToMany(() => Ocupaciones, (ocupaciones) => ocupaciones.cveClientes)
  ocupaciones: Ocupaciones[];
}
