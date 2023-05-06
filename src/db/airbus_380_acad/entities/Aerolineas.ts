import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Aeropuertos } from "./Aeropuertos";
import { Paises } from "./Paises";

@Index("pk_aerolineas", ["cveAerolineas"], { unique: true })
@Entity("aerolineas", { schema: "dbo" })
export class Aerolineas {
  @Column("int", { primary: true, name: "cve_aerolineas" })
  cveAerolineas: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 40 })
  nombre: string | null;

  @Column("int", { name: "flota", nullable: true })
  flota: number | null;

  @Column("int", { name: "numero_destinos", nullable: true })
  numeroDestinos: number | null;

  @Column("datetime", { name: "fecha_inicio_operaciones", nullable: true })
  fechaInicioOperaciones: Date | null;

  @ManyToOne(() => Aeropuertos, (aeropuertos) => aeropuertos.aerolineas)
  @JoinColumn([
    {
      name: "cve_aeropuertos__principal",
      referencedColumnName: "cveAeropuertos",
    },
  ])
  cveAeropuertosPrincipal: Aeropuertos;

  @ManyToOne(() => Paises, (paises) => paises.aerolineas)
  @JoinColumn([{ name: "cve_paises", referencedColumnName: "cvePaises" }])
  cvePaises: Paises;
}
