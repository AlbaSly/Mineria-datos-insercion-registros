import { Column, Entity, Index } from "typeorm";

@Index("pk_continentes", ["cveContinentes"], { unique: true })
@Entity("continentes", { schema: "dbo" })
export class Continentes {
  @Column("int", { primary: true, name: "cve_continentes" })
  cveContinentes: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 40 })
  nombre: string | null;
}
