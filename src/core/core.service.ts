import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ciudades } from 'src/db/airbus_380_acad/entities/Ciudades';
import { DIRSHelper } from 'src/helpers/dirs.helper';
import { Repository } from 'typeorm';

/**TODO: Crear Patrón Repository para conexión SQL */
import * as sql from "mssql";

@Injectable()
export class CoreService {
    constructor(
        @InjectRepository(Ciudades)
        private readonly CiudadesRepository: Repository<Ciudades>,
    ) {}

    async generateClients() {
        const nombresCSVPath: string = await DIRSHelper.getProjectCSVDIR("random_data_nombres");
        const apellidosCSVPath: string = await DIRSHelper.getProjectCSVDIR("random_data_apellidos");

        const data = await this.CiudadesRepository.find({});

        /**HACIENDO PRUEBA DE CONEXIÓN EN CRUDO */
        console.log("Conectando a la base de datos random_data");
        await sql.connect('Server=localhost,1433;Database=random_data;User Id=sa;Password=Albabianca15042002_;Encrypt=true;TrustServerCertificate=true')
        const result = await sql.query`select * from apellidos`;
        console.log(result);

        return data;
    }
}
