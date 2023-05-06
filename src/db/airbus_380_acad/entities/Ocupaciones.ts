import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { DetalleVuelos } from "./DetalleVuelos";
import { Clientes } from "./Clientes";

@Index("pk_ocupaciones", ["cveOcupaciones"], { unique: true })
@Entity("ocupaciones", { schema: "dbo" })
export class Ocupaciones {
  @Column("int", { primary: true, name: "cve_ocupaciones" })
  cveOcupaciones: number;

  @ManyToOne(() => DetalleVuelos, (detalleVuelos) => detalleVuelos.ocupaciones)
  @JoinColumn([
    { name: "cve_detalle_vuelos", referencedColumnName: "cveDetalleVuelos" },
  ])
  cveDetalleVuelos: DetalleVuelos;

  @ManyToOne(() => Clientes, (clientes) => clientes.ocupaciones)
  @JoinColumn([{ name: "cve_clientes", referencedColumnName: "cveClientes" }])
  cveClientes: Clientes;
}
