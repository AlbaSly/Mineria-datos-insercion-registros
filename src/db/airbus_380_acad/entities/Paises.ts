import { Column, Entity, Index, OneToMany } from "typeorm";
import { Aerolineas } from "./Aerolineas";
import { Ciudades } from "./Ciudades";

@Index("pk_paises", ["cvePaises"], { unique: true })
@Entity("paises", { schema: "dbo" })
export class Paises {
  @Column("int", { primary: true, name: "cve_paises" })
  cvePaises: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 40 })
  nombre: string | null;

  @Column("varchar", { name: "clave_internacional", nullable: true, length: 5 })
  claveInternacional: string | null;

  @Column("int", { name: "cve_continentes", nullable: true })
  cveContinentes: number | null;

  @OneToMany(() => Aerolineas, (aerolineas) => aerolineas.cvePaises)
  aerolineas: Aerolineas[];

  @OneToMany(() => Ciudades, (ciudades) => ciudades.cvePaises)
  ciudades: Ciudades[];
}
