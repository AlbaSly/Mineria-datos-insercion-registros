export interface IEstado {
    cveEstado: number;
    nombre: string;
    abreviatura: string;
}

export interface IMunicipio {
    cveMunicipios: number;
    cveEstados: number;
    nombre: string;
}

export interface ICliente {
    cveClientes: number;
    cveMunicipios: number;
    cveEstados: number;
    nombre: string;
    paterno: string;
    materno: string;
    fechaNacimiento: Date;
}

export interface IVuelo {
    cveVuelos: number;
    cveAerolineas: number;
    cveAeropuertosOrigen: number;
    cveAeropuertosDestino: number;
}

export interface IDetalleVuelos {
    cveDetalleVuelos: number;
    cve_Vuelos: number;
    fechaHoraSalida: Date;
    capacidad: number;
}