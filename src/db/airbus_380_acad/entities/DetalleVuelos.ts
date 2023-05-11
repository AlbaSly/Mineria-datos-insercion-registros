import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Vuelos } from "./Vuelos";
import { Ocupaciones } from "./Ocupaciones";

@Index("pk_detalle_vuelos", ["cveDetalleVuelos"], { unique: true })
@Entity("detalle_vuelos", { schema: "dbo" })
export class DetalleVuelos {
  @Column("int", { primary: true, name: "cve_detalle_vuelos" })
  cveDetalleVuelos: number;

  /**Columna auxiliar en referencia a cve_vuelos */
  @Column("int", {name: "cve_vuelos"})
  cve_Vuelos: number;

  @Column("datetime", { name: "fecha_hora_salida", nullable: true })
  fechaHoraSalida: Date | null;

  @Column("int", { name: "capacidad", nullable: true })
  capacidad: number | null;

  @ManyToOne(() => Vuelos, (vuelos) => vuelos.detalleVuelos)
  @JoinColumn([{ name: "cve_vuelos", referencedColumnName: "cveVuelos" }])
  cveVuelos: Vuelos;

  @OneToMany(() => Ocupaciones, (ocupaciones) => ocupaciones.cveDetalleVuelos)
  ocupaciones: Ocupaciones[];
}
