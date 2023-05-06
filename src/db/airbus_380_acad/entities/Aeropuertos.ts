import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Aerolineas } from "./Aerolineas";
import { Ciudades } from "./Ciudades";
import { Vuelos } from "./Vuelos";

@Index("pk_aeropuertos", ["cveAeropuertos"], { unique: true })
@Entity("aeropuertos", { schema: "dbo" })
export class Aeropuertos {
  @Column("int", { primary: true, name: "cve_aeropuertos" })
  cveAeropuertos: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 100 })
  nombre: string | null;

  @Column("varchar", { name: "clave_internacional", nullable: true, length: 3 })
  claveInternacional: string | null;

  @OneToMany(
    () => Aerolineas,
    (aerolineas) => aerolineas.cveAeropuertosPrincipal
  )
  aerolineas: Aerolineas[];

  @ManyToOne(() => Ciudades, (ciudades) => ciudades.aeropuertos)
  @JoinColumn([{ name: "cve_ciudades", referencedColumnName: "cveCiudades" }])
  cveCiudades: Ciudades;

  @OneToMany(() => Vuelos, (vuelos) => vuelos.cveAeropuertosOrigen)
  vuelos: Vuelos[];

  @OneToMany(() => Vuelos, (vuelos) => vuelos.cveAeropuertosDestino)
  vuelos2: Vuelos[];
}
