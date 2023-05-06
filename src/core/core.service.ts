import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ciudades } from 'src/db/airbus_380_acad/entities/Ciudades';
import { DIRSHelper } from 'src/helpers/dirs.helper';
import { Repository } from 'typeorm';

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

        return data;
    }
}
