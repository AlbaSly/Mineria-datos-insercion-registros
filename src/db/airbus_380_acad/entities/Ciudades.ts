import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Aeropuertos } from "./Aeropuertos";
import { Paises } from "./Paises";

@Index("pk_ciudades", ["cveCiudades"], { unique: true })
@Entity("ciudades", { schema: "dbo" })
export class Ciudades {
  @Column("int", { primary: true, name: "cve_ciudades" })
  cveCiudades: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 40 })
  nombre: string | null;

  @OneToMany(() => Aeropuertos, (aeropuertos) => aeropuertos.cveCiudades)
  aeropuertos: Aeropuertos[];

  @ManyToOne(() => Paises, (paises) => paises.ciudades)
  @JoinColumn([{ name: "cve_paises", referencedColumnName: "cvePaises" }])
  cvePaises: Paises;
}
