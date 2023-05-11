import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Estados } from "src/db/airbus_380_acad/entities/Estados";
import { ICliente, IDetalleVuelos, IEstado, IMunicipio } from "./interfaces";
import { ArraysUtils } from "src/utils/arrays.utils";
import { Municipios } from "src/db/airbus_380_acad/entities/Municipios";
import { CoreHelperService } from "./helpers/index.service";
import { Clientes } from 'src/db/airbus_380_acad/entities/Clientes';
import { Vuelos } from 'src/db/airbus_380_acad/entities/Vuelos';
import { DetalleVuelos } from 'src/db/airbus_380_acad/entities/DetalleVuelos';
import { Ocupaciones } from 'src/db/airbus_380_acad/entities/Ocupaciones';

@Injectable()
export class CoreService {
    private readonly CLIENTES_SIZE: number = 100000; // cien mil
    private readonly DETALLE_VUELOS_SIZE: number = 4000; // cuatro mil
    private readonly OCUPACIONES_MIN_RECORDS_COUNT: number = 1000000; // un millón
    private readonly VUELOS_MIN_CAPACITY: number = 350;
    private readonly VUELOS_MAX_CAPACITY: number = 500;
    private readonly VUELOS_MIN_MAX_MULT: number = 50;
    private readonly VUELOS_YEAR: number = 2022; // Año del cual se generarán las fechas aleatorias

    private arrayOfEstados: Array<IEstado> = [];
    private arrayOfMunicipios: Array<IMunicipio> = [];
    private arrayOfClientes: Array<ICliente> = new Array(this.CLIENTES_SIZE);
    private arrayOfVuelos: Array<Vuelos> = [];
    private arrayOfDetallesVuelos: Array<IDetalleVuelos> = new Array(this.DETALLE_VUELOS_SIZE);
    private arrayOfOcupaciones: Array<Ocupaciones> = new Array(this.OCUPACIONES_MIN_RECORDS_COUNT);

    private arrayOfNombres: Array<string> = [];
    private arrayOfApellidos: Array<string> = [];

    constructor(
        private readonly dataSource: DataSource,
        private readonly coreHelperService: CoreHelperService,
    ) {}

    async generateData() {
        await this.coreHelperService.genSeed(
            this.arrayOfEstados,
            this.arrayOfMunicipios,
            this.arrayOfNombres,
            this.arrayOfApellidos,
            this.arrayOfVuelos,
        );

        await this.insertEstados();
        await this.insertMunicipios();
        await this.generateAndInsertClients();
        await this.generateAndInsertDetalleVuelos();
        await this.generateAndInsertOcupaciones();
    }

    private async insertEstados() {
        return new Promise<void>(async (resolve, reject) => {
            console.log("Insertando datos (Estados)...");
            const startTime: number = Date.now();
            await this.dataSource.createQueryBuilder().insert().into(Estados).values([...this.arrayOfEstados]).execute();
            const endTime: number = Date.now();
            console.log("Tarea finalizada: ", (endTime-startTime), "ms");
            resolve();
        });
    }

    private async insertMunicipios() {
        return new Promise<void>(async (resolve, reject) => {
            console.log("Insertando datos (Municipios)...");
            const startTime: number = Date.now();
            console.log("Optimizando array de ", this.arrayOfMunicipios.length, " elementos...");
            const municipiosChunks: Array<Array<IMunicipio>> = ArraysUtils.sliceIntoChunks(this.arrayOfMunicipios, 500);
    
            console.log("Arrays generados: ", municipiosChunks.length, " de 500 elementos cada uno");
            console.log("Preparando inserción en la DB...");
            let chunkCounter: number = 0;
            for await (const chunk of municipiosChunks) {
                ++chunkCounter;
                await this.dataSource.createQueryBuilder().insert().into(Municipios).values(chunk).execute();
                console.log("Chunk de Municipios #", chunkCounter, " insertado correctamente...");
            }
            const endTime: number = Date.now();
            console.log("Tarea finalizada: ", (endTime-startTime), "ms");
            resolve();
        })
    }

    private async generateAndInsertClients() {
        return new Promise<void>(async (resolve, reject) => {
            console.log("Generando datos (clientes...)");
            for (let x = 0; x < this.CLIENTES_SIZE; x++) {
                this.arrayOfClientes[x] = this.coreHelperService.GenerateRandomClienteObject(x, this.arrayOfNombres, this.arrayOfApellidos, this.arrayOfMunicipios);
            }
            const startTime: number = Date.now();
            console.log("Optimizando array de ", this.arrayOfClientes.length, " elementos...");
            const clientesChunks: Array<Array<ICliente>> = ArraysUtils.sliceIntoChunks(this.arrayOfClientes, 50);
            console.log("Arrays generados: ", clientesChunks.length, " de 50 elementos cada uno");
            console.log("Preparando inserción en la DB...");
            let chunkCounter: number = 0;
            for await (const chunk of clientesChunks) {
                ++chunkCounter;
                await this.dataSource.createQueryBuilder().insert().into(Clientes).values(chunk).execute();
                console.log("Chunk de Clientes #", chunkCounter, " insertado correctamente");
            }
            const endTime: number = Date.now();
            console.log("Tarea finalizada: ", (endTime-startTime), "ms");

            resolve();
        })
    }

    private async generateAndInsertDetalleVuelos() {
        return new Promise<void>(async (resolve, reject) => {
            console.log("Generando datos (detalles_vuelos)...");
            for (let x = 0; x < this.DETALLE_VUELOS_SIZE; x++) {
                this.arrayOfDetallesVuelos[x] = this.coreHelperService.GenerateRandomDetallesVuelosObject(
                    x, 
                    this.arrayOfVuelos, 
                    this.VUELOS_MIN_CAPACITY, 
                    this.VUELOS_MAX_CAPACITY, 
                    this.VUELOS_MIN_MAX_MULT, 
                    this.VUELOS_YEAR
                );
            }
            const startTime: number = Date.now();
            console.log("Optimizando array de ", this.arrayOfDetallesVuelos.length, " elementos...");
            const detallesVuelosChunks: Array<Array<IDetalleVuelos>> = ArraysUtils.sliceIntoChunks<IDetalleVuelos>(this.arrayOfDetallesVuelos, 50);
            console.log("Arrays generados: ", detallesVuelosChunks.length, " de 50 elementos cada uno");
            console.log("Preparando inserción en la DB...");
            let chunkCounter: number = 0;
            for await (const chunk of detallesVuelosChunks) {
                ++chunkCounter;
                await this.dataSource.createQueryBuilder().insert().into(DetalleVuelos).values(chunk).execute();
                console.log("Chunk de Detalles Vuelos #", chunkCounter, " insertado correctamente");
            }
            const endTime: number = Date.now();
            console.log("Tarea finalizada: ", (endTime-startTime), "ms");

            resolve();
        });
    }

    private async generateAndInsertOcupaciones() {
        return new Promise<void>(async (resolve, reject) => {
            console.log("Generando datos (Ocupaciones)...");
            await this.coreHelperService.GenerateRandomOcupacion(this.arrayOfClientes, this.arrayOfDetallesVuelos, this.OCUPACIONES_MIN_RECORDS_COUNT, this.arrayOfOcupaciones);

            const startTime: number = Date.now();

            console.log("Optimizando array de ", this.arrayOfOcupaciones.length, " elementos...");
            const ocupacionesChunks: Array<Array<Ocupaciones>> = ArraysUtils.sliceIntoChunks<Ocupaciones>(this.arrayOfOcupaciones, 50);
            console.log("Arrays generados: ", ocupacionesChunks.length, " de 50 elementos cada uno");

            console.log("Preparando inserción en la DB...");
            let chunkCounter: number = 0;
            for await (const chunk of ocupacionesChunks) {
                ++chunkCounter;
                await this.dataSource.createQueryBuilder().insert().into(Ocupaciones).values(chunk).execute();
                console.log("Chunk de Ocupaciones #", chunkCounter, " insertado correctamente");
            }
            const endTime: number = Date.now();
            console.log("Tarea finalizada: ", (endTime-startTime), "ms");

            resolve();
        });
    }
}
