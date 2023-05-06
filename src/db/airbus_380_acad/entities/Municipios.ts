import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Clientes } from "./Clientes";
import { Estados } from "./Estados";

@Index("pk_municipios", ["cveMunicipios", "cveEstados"], { unique: true })
@Entity("municipios", { schema: "dbo" })
export class Municipios {
  @Column("int", { primary: true, name: "cve_municipios" })
  cveMunicipios: number;

  @Column("int", { primary: true, name: "cve_estados" })
  cveEstados: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 50 })
  nombre: string | null;

  @OneToMany(() => Clientes, (clientes) => clientes.municipios)
  clientes: Clientes[];

  @ManyToOne(() => Estados, (estados) => estados.municipios)
  @JoinColumn([{ name: "cve_estados", referencedColumnName: "cveEstados" }])
  cveEstados2: Estados;
}
