import * as fs from "fs";
import * as StreamArray from "stream-json/streamers/StreamArray";
import { ArraysUtils } from "src/utils/arrays.utils";
import { ICliente, IDetalleVuelos, IEstado, IMunicipio } from "../interfaces";
import { DIRSHelper } from "src/helpers/dirs.helper";
import { DatesUtils } from "src/utils/dates.utils";
import { DataSource, Repository, getConnection } from "typeorm";
import { Vuelos } from "src/db/airbus_380_acad/entities/Vuelos";
import { Injectable } from "@nestjs/common";
import { NumbersUtils } from "src/utils/numbers.utils";
import { Ocupaciones } from "src/db/airbus_380_acad/entities/Ocupaciones";
import { DetalleVuelos } from "src/db/airbus_380_acad/entities/DetalleVuelos";

@Injectable()
export class CoreHelperService {
    private isDataGenerated: boolean = false;

    constructor(
        private readonly dataSource: DataSource,
    ) {}

    GenerateRandomClienteObject(id: number, arrayNombres: Array<string>, arrayApellidos: Array<string>, arrayMunicipios: Array<IMunicipio>): ICliente {
        const randomNombre = ArraysUtils.getRandomValue<string>(arrayNombres);
        const randomApellidoPaterno = ArraysUtils.getRandomValue<string>(arrayApellidos);
        const randomApellidoMaterno = ArraysUtils.getRandomValue<string>(arrayApellidos);
        const randomMunicipio = ArraysUtils.getRandomValue<IMunicipio>(arrayMunicipios);

        const clienteCreated: ICliente = {
            cveClientes: id,
            cveEstados: randomMunicipio.cveEstados,
            cveMunicipios: randomMunicipio.cveMunicipios,
            nombre: randomNombre,
            paterno: randomApellidoPaterno,
            materno: randomApellidoMaterno,
            fechaNacimiento: DatesUtils.GenRandomDateByAge(5, 90),
        }
        
        return clienteCreated;
    }

    GenerateRandomDetallesVuelosObject(index: number, arrayOfVuelos: Array<Vuelos>, minCapacity: number, maxCapacity: number, minCMaxCMult: number, year: number): IDetalleVuelos {
        const randomCapacidad: number = NumbersUtils.genRandomNumbBetweenRangeAndMult(minCapacity, maxCapacity, minCMaxCMult);
        const randomDate: Date = DatesUtils.GenRandomDateByYear(year);
        const randomVuelo: Vuelos = ArraysUtils.getRandomValue<Vuelos>(arrayOfVuelos);

        const detalleVueloCreated: IDetalleVuelos = {
            cveDetalleVuelos: index,
            cve_Vuelos: randomVuelo.cveVuelos,
            capacidad: randomCapacidad,
            fechaHoraSalida: randomDate,
        }

        return detalleVueloCreated;
    }
    
    GenerateRandomOcupacion(arrayOfClientes: Array<ICliente>, arrayOfDetallesVuelos: Array<IDetalleVuelos>, amount: number, arrayOfOcupaciones: Array<Ocupaciones>) {
        return new Promise<void>(async (resolve, reject) => {
            let recordsGenerated: number = 0;
            
            const ocupacionesREP = this.dataSource.getRepository(Ocupaciones);

            const startTime: number = Date.now();
            while (recordsGenerated < amount) {
                const randomCliente: ICliente = ArraysUtils.getRandomValue<ICliente>(arrayOfClientes);
                const randomDetalleVuelos: IDetalleVuelos = ArraysUtils.getRandomValue<IDetalleVuelos>(arrayOfDetallesVuelos);
                
                const ocupacionesFoundByClienteAndDetalleVuelosIndex = arrayOfOcupaciones.findIndex(e => 
                    (e && e.cve_clientes && e.cve_clientes === randomCliente.cveClientes )
                    && 
                    (e && e.cve_detalle_vuelos && e.cve_detalle_vuelos === randomDetalleVuelos.cveDetalleVuelos));

                /**Determinar si ya se encuentra esa combinación en el arreglo */
                if (ocupacionesFoundByClienteAndDetalleVuelosIndex > -1) continue;

                const ocupacionesFoundByCveDetalleVuelos: Array<Ocupaciones> = [...arrayOfOcupaciones.filter(e => e.cve_detalle_vuelos === randomDetalleVuelos.cveDetalleVuelos)];
            
                /**Determinar si se ha llegado a la capacidad máxima en Detalle Vuelos */
                if (ocupacionesFoundByCveDetalleVuelos.length === randomDetalleVuelos.capacidad) continue;

                const ocupacionCreated = ocupacionesREP.create({
                    cveOcupaciones: recordsGenerated,
                    cve_clientes: randomCliente.cveClientes,
                    cve_detalle_vuelos: randomDetalleVuelos.cveDetalleVuelos,  
                });

                /**Guardar la ocupación */
                arrayOfOcupaciones[recordsGenerated] = ocupacionCreated;
                recordsGenerated++;
                console.log("Generación de la ocupación #", recordsGenerated,);
            }
            const endTime: number = Date.now();
            console.log("Tarea finalizada.", (endTime-startTime), " ms");
            resolve();
        });
    }

    async genSeed(
        arrayOfEstados: Array<IEstado>,
        arrayOfMunicipios: Array<IMunicipio>,
        arrayOfNombres: Array<string>,
        arrayOfApellidos: Array<string>,
        arrayOfVuelos: Array<Vuelos>,
    ) {
        return new Promise<void>(async (resolve, reject) => {
            if (this.isDataGenerated) {
                console.log("La data ha sido generada...");
                return reject();
            }

            console.log("\nGeneración de la data...");
            const startTime: number = Date.now();

            await Promise.all([
                this.setEstados(arrayOfEstados),
                this.setMunicipios(arrayOfMunicipios),
                this.setNombres(arrayOfNombres),
                this.setApellidos(arrayOfApellidos),
                this.setVuelos(arrayOfVuelos),
            ]);
            this.isDataGenerated = true;

            const endTime: number = Date.now();
            console.log("GENERACIÓN DE LOS SEEDS COMPLETADA: ", (endTime - startTime), "ms\n");
            resolve();
        });
    }

    private async setEstados(arrayOfEstados: Array<IEstado>) {
        return new Promise<void>(async (resolve, reject) => {
            const estadosJSONPath: string = await DIRSHelper.getJSONFile("random_data_estados");
            const jsonStream = StreamArray.withParser();
    
            fs.createReadStream(estadosJSONPath).pipe(jsonStream.input as any);
            jsonStream.on('data', ({key, value}) => {
                // console.log(key, value);
                arrayOfEstados.push({
                    cveEstado: value.cve_estado,
                    nombre: value.nombre,
                    abreviatura: value.abreviatura,
                });
            });
            jsonStream.on('end', async () => {
                console.log("Estados almacenados de forma local");
                resolve();
            });
        });
    }

    private async setMunicipios(arrayOfMunicipios: Array<IMunicipio>) {
        return new Promise<void>(async (resolve, reject) => {
            const municipiosJSONPath: string = await DIRSHelper.getJSONFile("random_data_municipios");
            const jsonStream = StreamArray.withParser();
    
            fs.createReadStream(municipiosJSONPath).pipe(jsonStream.input as any);
            jsonStream.on('data', ({key, value}) => {
                // console.log(key, value);
                arrayOfMunicipios.push({
                    cveEstados: value.cve_estados,
                    cveMunicipios: value.cve_municipios,
                    nombre: value.nombre
                });
            });
            jsonStream.on('end', async () => {
                console.log("Municipios almacenados de forma local");
                resolve();
            }); 
        });
    }

    private async setNombres(arrayOfNombres: Array<string>) {
        return new Promise<void>(async (resolve, reject) => {
            const nombresJSONPath: string = await DIRSHelper.getJSONFile("random_data_nombres");
            
            const nombresJSONStream = StreamArray.withParser();

            fs.createReadStream(nombresJSONPath).pipe(nombresJSONStream.input as any);
            nombresJSONStream.on('data', ({key, value}) => {
                arrayOfNombres.push(value.nombre);
            });
            nombresJSONStream.on('end', () => {
                console.log("Nombres almacenados de forma local");
                resolve();
            });
        });
    }

    private async setApellidos(arrayOfApellidos: Array<string>) {
        return new Promise<void>(async (resolve, reject) => {
            const apellidosJSONPath: string = await DIRSHelper.getJSONFile("random_data_apellidos");
            const apellidosJSONStream = StreamArray.withParser();
    
            fs.createReadStream(apellidosJSONPath).pipe(apellidosJSONStream.input as any);
            apellidosJSONStream.on('data', ({key, value}) => {
                arrayOfApellidos.push(value.apellido);
            });
            apellidosJSONStream.on('end', () => {
                console.log("Apellidos almacenados de forma local");
                resolve();
            });
        });
    }
    
    private async setVuelos(arrayOfVuelos: Array<Vuelos>) {
        return new Promise<void>(async (resolve, reject) => { 
            const REP_Vuelos: Repository<Vuelos> = this.dataSource.getRepository(Vuelos);

            /**Se especifica que el origen o destino será México (9) */
            const data: Array<Vuelos> = await REP_Vuelos.createQueryBuilder('vuelos')
                .where('vuelos.cve_aeropuertos__origen = :origen', {origen: 9})
                .orWhere('vuelos.cve_aeropuertos__destino = :destino', {destino: 9})
                .getMany();
            
            for (let x = 0; x < data.length; x++) {
                arrayOfVuelos[x] = data[x];
            }

            console.log("Vuelos pertenecientes a México almacenados de forma local");

            resolve();
        });
    }
}