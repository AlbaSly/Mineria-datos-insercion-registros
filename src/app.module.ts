import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { Aerolineas } from './db/airbus_380_acad/entities/Aerolineas';
import { Aeropuertos } from './db/airbus_380_acad/entities/Aeropuertos';
import { Ciudades } from './db/airbus_380_acad/entities/Ciudades';
import { Clientes } from './db/airbus_380_acad/entities/Clientes';
import { Continentes } from './db/airbus_380_acad/entities/Continentes';
import { DetalleVuelos } from './db/airbus_380_acad/entities/DetalleVuelos';
import { Estados } from './db/airbus_380_acad/entities/Estados';
import { Municipios } from './db/airbus_380_acad/entities/Municipios';
import { Ocupaciones } from './db/airbus_380_acad/entities/Ocupaciones';
import { Paises } from './db/airbus_380_acad/entities/Paises';
import { Vuelos } from './db/airbus_380_acad/entities/Vuelos';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'Albabianca15042002_',
      database: 'airbus_380_acad',
      entities: [
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
        Vuelos,
      ],
      extra: {
        trustServerCertificate: true,
      },
      synchronize: false,
      autoLoadEntities: true,
    }),
    CoreModule,
    // TypeOrmModule.forRoot({
    //   name: 'random_data DATABASE',
    //   type: 'mssql',
    //   host: 'localhost',
    //   port: 1433,
    //   username: 'sa',
    //   password: 'Albabianca15042002_',
    //   database: 'random_data',
    //   entities: [
    //     ...randomDataEntitites,
    //   ],
    //   extra: {
    //     trustServerCertificate: true,
    //   }
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
