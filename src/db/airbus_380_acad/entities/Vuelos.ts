import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { DetalleVuelos } from "./DetalleVuelos";
import { Aeropuertos } from "./Aeropuertos";

@Index("pk_vuelos", ["cveVuelos"], { unique: true })
@Entity("vuelos", { schema: "dbo" })
export class Vuelos {
  @Column("int", { primary: true, name: "cve_vuelos" })
  cveVuelos: number;

  @Column("int", { name: "cve_aerolineas", nullable: true })
  cveAerolineas: number | null;

  @OneToMany(() => DetalleVuelos, (detalleVuelos) => detalleVuelos.cveVuelos)
  detalleVuelos: DetalleVuelos[];

  @ManyToOne(() => Aeropuertos, (aeropuertos) => aeropuertos.vuelos)
  @JoinColumn([
    { name: "cve_aeropuertos__origen", referencedColumnName: "cveAeropuertos" },
  ])
  cveAeropuertosOrigen: Aeropuertos;

  @ManyToOne(() => Aeropuertos, (aeropuertos) => aeropuertos.vuelos2)
  @JoinColumn([
    {
      name: "cve_aeropuertos__destino",
      referencedColumnName: "cveAeropuertos",
    },
  ])
  cveAeropuertosDestino: Aeropuertos;
}
