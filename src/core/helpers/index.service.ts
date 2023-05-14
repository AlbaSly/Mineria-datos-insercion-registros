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

/**
 * Clase Service Auxiliar para la lógica con "menos" relevancia del módulo Core
 */
@Injectable()
export class CoreHelperService {

    constructor(
        private readonly dataSource: DataSource,
    ) {}

    /**
     * Genera de forma aleatoria un objeto de tipo ICliente cuyos datos se obtiene aleatoriamente de otros arreglos
     * @param id identificador
     * @param arrayNombres arreglo de nombres
     * @param arrayApellidos arreglo de apellidos
     * @param arrayMunicipios arreglo de municipios
     * @returns Objeto ICliente
     */
    GenerateRandomClienteObject(id: number, arrayNombres: Array<string>, arrayApellidos: Array<string>, arrayMunicipios: Array<IMunicipio>): ICliente {
        const randomNombre: string = ArraysUtils.getRandomValue<string>(arrayNombres);
        const randomApellidoPaterno: string = ArraysUtils.getRandomValue<string>(arrayApellidos);
        const randomApellidoMaterno: string = ArraysUtils.getRandomValue<string>(arrayApellidos);
        const randomMunicipio: IMunicipio = ArraysUtils.getRandomValue<IMunicipio>(arrayMunicipios);

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

    /**
     * Genera de forma aleatoria un objeto de tipo IDetallesVuelos, cuya generación deriva del arreglo de vuelos
     * @param index identificador 
     * @param arrayOfVuelos arreglo de vuelos
     * @param minCapacity capacidad mínima
     * @param maxCapacity capacidad máxima
     * @param minCMaxCMult múltiplo
     * @param year año del que se generará la fecha aleatoria
     * @returns Objeto IDetalleVuelos
     */
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
    
    /**
     * Genera de forma aleatoria objetos de tipo Ocupaciones, y los inserta dentro el array proporcionado
     * @param arrayOfClientes arreglo de Clientes
     * @param arrayOfDetallesVuelos arreglo de Detalles Vuelos
     * @param amount cantidad de generaciones 
     * @param arrayOfOcupaciones arreglo de Ocupaciones
     * @returns Promesa Resuelta
     */
    GenerateRandomOcupacion(arrayOfClientes: Array<ICliente>, arrayOfDetallesVuelos: Array<IDetalleVuelos>, amount: number): Promise<Ocupaciones[][]> {
        
        const maxItemsPerChunk: number = 10000;
        let itemsPerChunkCounter: number = 0;

        let matrixOfOcupaciones: Array<Array<Ocupaciones>> = new Array();
        let chunkCounter: number = 0;
        
        return new Promise(async (resolve, reject) => {
            let rowChunkAux: Array<Ocupaciones> = new Array();

            let matrixRowGenerationStartTime: number = Date.now();
            try {
                let recordsGenerated: number = 0;
            
                /**Creación de la conexión al repositorio de Ocupaciones */
                const ocupacionesREP: Repository<Ocupaciones> = this.dataSource.getRepository(Ocupaciones);
    
                const startTime: number = Date.now();
                /**Realizar el ciclo hasta completar la cantidad de generaciones */
                while (recordsGenerated <= amount) {
                    /**Obtener cliente aleatorio */
                    const randomCliente: ICliente = ArraysUtils.getRandomValue<ICliente>(arrayOfClientes);
                    /**Obtener detalle vuelos aleatorio */
                    const randomDetalleVuelos: IDetalleVuelos = ArraysUtils.getRandomValue<IDetalleVuelos>(arrayOfDetallesVuelos);
                    
                    /**Encontrar la combinación de cliente aleatorio y detalle vuelos aleatorio dentro del arreglo de ocupaciones */
                    // const ocupacionesFoundByClienteAndDetalleVuelosIndex = arrayOfOcupaciones.findIndex(e => 
                    //     (e && e.cve_clientes && e.cve_clientes === randomCliente.cveClientes )
                    //     && 
                    //     (e && e.cve_detalle_vuelos && e.cve_detalle_vuelos === randomDetalleVuelos.cveDetalleVuelos));
    
                    /**Determinar si ya se encuentra esa combinación en el arreglo */
                    // if (ocupacionesFoundByClienteAndDetalleVuelosIndex > -1) continue;
                    const ocupacionesFoundByClienteAndDetalleVuelos = ArraysUtils.existItemInMatrix(matrixOfOcupaciones, (e) =>
                        (e && e.cve_clientes && e.cve_clientes === randomCliente.cveClientes)
                        &&
                        (e && e.cve_detalle_vuelos && e.cve_detalle_vuelos === randomDetalleVuelos.cveDetalleVuelos)
                    );
                    /**Si se encuentra, saltar a la siguiente iteración */
                    if (ocupacionesFoundByClienteAndDetalleVuelos) continue;
    
                    /**Buscar todas las ocupaciones que estén relacionadas a la clave de detalles vuelos */
                    // const ocupacionesFoundByCveDetalleVuelos: Array<Ocupaciones> = [...arrayOfOcupaciones.filter(e => e.cve_detalle_vuelos === randomDetalleVuelos.cveDetalleVuelos)];
                    
                    const ocupacionesFoundByCveDetalleVuelos: Array<Ocupaciones> = [...ArraysUtils.filterMatrixInOneArray(matrixOfOcupaciones, (e => e.cve_detalle_vuelos === randomDetalleVuelos.cveDetalleVuelos))];
    
                    /**Determinar si se ha llegado a la capacidad máxima en Detalle Vuelos, por lo que se salta a la siguiente iteración */
                    if (ocupacionesFoundByCveDetalleVuelos.length === randomDetalleVuelos.capacidad) continue;
    
                    /**Se crea la entidad Ocupaciones con ayuda del repositorio */
                    const ocupacionCreated = ocupacionesREP.create({
                        cveOcupaciones: recordsGenerated,
                        cve_clientes: randomCliente.cveClientes,
                        cve_detalle_vuelos: randomDetalleVuelos.cveDetalleVuelos,  
                    });
    
                    /**Reiniciar conteo de items por chunk y generar en la siguiente fila de la matrix */
                    if (itemsPerChunkCounter === maxItemsPerChunk) {
                        /**Aumentar el contador de chunks*/
                        chunkCounter++;
                        /**Reiniciar el contador de items por chunk */
                        itemsPerChunkCounter = 0;
                        /**Pushear el chunk dentro de la matriz */
                        matrixOfOcupaciones.push(rowChunkAux);
                        /**Limpiar el chunk */
                        rowChunkAux = [];
                    }
                    
                    rowChunkAux[itemsPerChunkCounter] = ocupacionCreated;
                    itemsPerChunkCounter++;
    
                    /**Guardar la ocupación dentro del arreglo externo*/
                    // arrayOfOcupaciones[recordsGenerated-1] = ocupacionCreated;
                    // console.log("Generación de la ocupación #", recordsGenerated,);
                    /**Iterar una vez validado todo lo anterior */
                    ++recordsGenerated;
                    if (recordsGenerated%10000 === 0) {
                        const matrixRowGenerationEndTime: number = Date.now();
                        console.log("Se han generado", recordsGenerated, "ocupaciones de ", amount, " ->");
                        console.log("\tElementos en chunk de índice #", chunkCounter, ":", itemsPerChunkCounter);
                        console.log("\t\tDuración", (matrixRowGenerationEndTime-matrixRowGenerationStartTime), " ms");
                        /**Reiniciar el contador del inicio de generación de la fila */
                        matrixRowGenerationStartTime = Date.now();
                    }
                }
                const endTime: number = Date.now();
                console.log("Tarea finalizada.", (endTime-startTime), " ms");
    
    
                resolve(matrixOfOcupaciones);
            } catch (error) {
                console.log("Error durante la iteración y generación de ocupaciones:\n", error);
            }
        });
    }

    /**
     * Método que realiza la lectura y o generación de los datos para su manipulación
     * @param arrayOfEstados arreglo vacío de objetos de tipo IEstado
     * @param arrayOfMunicipios arreglo vacío de objetos tipo IMunicipio
     * @param arrayOfNombres arreglo vacío de cadenas representando nombres
     * @param arrayOfApellidos arreglo vacío de cadenas representando apellidos
     * @param arrayOfVuelos arreglo vacío de objetos de tipo Vuelos
     * @returns Promesa Resuelta
     */
    async genSeed(
        arrayOfEstados: Array<IEstado>,
        arrayOfMunicipios: Array<IMunicipio>,
        arrayOfNombres: Array<string>,
        arrayOfApellidos: Array<string>,
        arrayOfVuelos: Array<Vuelos>,
    ) {
        return new Promise<void>(async (resolve, reject) => {

            console.log("\nGeneración de la data...");
            const startTime: number = Date.now();

            await Promise.all([
                this.setEstados(arrayOfEstados),
                this.setMunicipios(arrayOfMunicipios),
                this.setNombres(arrayOfNombres),
                this.setApellidos(arrayOfApellidos),
                this.setVuelos(arrayOfVuelos),
            ]);

            const endTime: number = Date.now();
            console.log("GENERACIÓN DE LOS SEEDS COMPLETADA: ", (endTime - startTime), "ms\n");
            resolve();
        });
    }

    /**
     * Lectura del JSON de estados e inserción dentro del arreglo
     * @param arrayOfEstados arreglo vacío de Estados
     * @returns Promesa Resuelta
     */
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

    /**
     * Lectura del JSON de municipios e inserción dentro del arreglo
     * @param arrayOfMunicipios arreglo vacío de Municipios
     * @returns Promesa Resuelta
     */
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

    /**
     * Lectura del JSON de nombres e inserción dentro del arreglo
     * @param arrayOfNombres arreglo vacío de nombres
     * @returns Promesa Resuelta
     */
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

    /**
     * Lectura del JSON de apellidos e inserción dentro del arreglo
     * @param arrayOfApellidos arreglo vacío de apellidos
     * @returns Promesa Resuelta
     */
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

    /**
     * Consulta de los vuelos cuyo aeropuerto de origen o de salida pertenezca a uno de cierto país, en este caso, el código de México (9)
     * @param arrayOfVuelos arreglo vacío de Vuelos
     * @returns Promesa Resuelta
     */
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