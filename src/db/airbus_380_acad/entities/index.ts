import { Aerolineas } from "./Aerolineas";
import { Aeropuertos } from "./Aeropuertos";
import { Ciudades } from "./Ciudades";
import { Clientes } from "./Clientes";
import { Continentes } from "./Continentes";
import { DetalleVuelos } from "./DetalleVuelos";
import { Ocupaciones } from "./Ocupaciones";
import { Paises } from "./Paises";
import { Vuelos } from "./Vuelos";
import { Estados } from "./Estados";
import { Municipios } from "./Municipios";

/**
 * Array de Entidades TypeORM para la BD airbus_380_acad
 */
export const airbus380acadEntitites = [
    Aerolineas,
    Aeropuertos,
    Ciudades,
    Clientes,
    Continentes,
    DetalleVuelos,
    Estados,
    Municipios,
    Ocupaciones,
    Paises,
    Vuelos
];