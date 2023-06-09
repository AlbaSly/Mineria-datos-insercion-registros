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

/**
 * Clase Service para la lógica del módulo Core
 */
@Injectable()
export class CoreService {
    /**Cantidad total de clientes a generar */
    private readonly CLIENTES_SIZE: number = 100000; // cien mil
    /**Cantidad total de detalles vuelos a generar */
    private readonly DETALLE_VUELOS_SIZE: number = 4000; // cuatro mil
    /**Cantidad mínima de ocupaciones a generar */
    private readonly OCUPACIONES_MIN_RECORDS_COUNT: number = 1000000; // un millón
    /**Capacidad mínima del vuelo */
    private readonly VUELOS_MIN_CAPACITY: number = 350;
    /**Capacidad máxima del vuelo */
    private readonly VUELOS_MAX_CAPACITY: number = 500;
    /**Múltiplos dependientes del rango entre la capacidad mínima y máxima del vuelo */
    private readonly VUELOS_MIN_MAX_MULT: number = 50;
    /**Año del cuál se generarán las fechas aleatorias */
    private readonly VUELOS_YEAR: number = 2022;

    /**Arreglo de objetos IEstado */
    private arrayOfEstados: Array<IEstado> = [];
    /**Arreglo de objetos IMunicipio */
    private arrayOfMunicipios: Array<IMunicipio> = [];
    /**Arreglo de objetos ICliente, con longitud establecida inicialmente */
    private arrayOfClientes: Array<ICliente> = new Array(this.CLIENTES_SIZE);
    /**Arreglo de objetos Entidad Vuelos */
    private arrayOfVuelos: Array<Vuelos> = [];
    /**Arreglo de objetos IDetalleVuelos, con longitud establecida inicialmente */
    private arrayOfDetallesVuelos: Array<IDetalleVuelos> = new Array(this.DETALLE_VUELOS_SIZE);
    /**Arreglo de objetos Entidad Ocupaciones, con longitud establecida inicialmente */
    // private arrayOfOcupaciones: Array<Ocupaciones> = new Array(this.OCUPACIONES_MIN_RECORDS_COUNT);

    /**Array de nombres que se traerán del JSON */
    private arrayOfNombres: Array<string> = [];
    /**Array de apellidos que se traerán del JSON */
    private arrayOfApellidos: Array<string> = [];

    /**
     * Clase constructor con inyección de dependencias
     * @param dataSource Inyección de dependencias del TypeORM DataSource de nuestra Base de Datos
     * @param coreHelperService Inyección de dependencias del Servicio auxiliar CoreHelper
     */
    constructor(
        private readonly dataSource: DataSource,
        private readonly coreHelperService: CoreHelperService,
    ) {}

    /**
     * Servicio para la generación de toda la data de la aplicación de forma escalonada
     */
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

    /** (1)
     * Servicio privado para la lectura e inserción de los Estados en la Base de Datos
     * @returns Promesa Resuelta
     */
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

    /** (2)
     * Servicio privado para la lectura e inserción de los Municipios en la Base de Datos
     * @returns Promesa Resuelta
     */
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

    /** (3)
     * Servicio privado para la generación e inserción de los Clientes en la Base de Datos
     * @returns Promesa Resuelta
     */
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

    /** (4)
     * Servicio privado para la generación e inserción de los DetallesVuelos en la Base de Datos
     * @returns Promesa Resuelta
     */
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

    /** (5)
     * Servicio privado para la generación e inserción de las Ocupaciones en la base de datos;
     * @returns Promesa Resuelta
     */
    private async generateAndInsertOcupaciones() {
        return new Promise<void>(async (resolve, reject) => {

            console.log("Generando datos (Ocupaciones)...");
            const matrixOfOcupaciones: Array<Array<Ocupaciones>> = await this.coreHelperService.GenerateRandomOcupaciones(this.arrayOfClientes, this.arrayOfDetallesVuelos, this.OCUPACIONES_MIN_RECORDS_COUNT);

            const startTime: number = Date.now();

            console.log("Optimizando matriz de ", matrixOfOcupaciones.length, " arreglos...");
            console.log("Iterando a dentro de la matriz...");
            
            /**Contador para la fila de cada matriz */
            let matrixRowCounter = 0;
            for (const arrayOfOcupaciones of matrixOfOcupaciones) {
                console.log("\tOptimizando arreglo con índice", matrixRowCounter);
                
                const ocupacionesChunks: Array<Array<Ocupaciones>> = ArraysUtils.sliceIntoChunks<Ocupaciones>(arrayOfOcupaciones, 50);

                console.log("\t\tChunks generados:", ocupacionesChunks.length, "de 50 elementos cada uno");
                console.log("\t\tPreparando inserción de la DB...");
                
                let chunkCounter: number = 0;
                for await (const chunk of ocupacionesChunks) {
                    await this.dataSource.createQueryBuilder().insert().into(Ocupaciones).values(chunk).execute();
                    
                    ++chunkCounter;
                    console.log("\t\t\tChunk de Ocupaciones #", chunkCounter, "insertado correctamente");
                }
                ++matrixRowCounter;
            }
            const endTime: number = Date.now();
            
            console.log("Tarea finalizada: ", (endTime-startTime), "ms");
            resolve();
        });
    }
}
