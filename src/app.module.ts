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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
  
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
    //   host: '',
    //   port: 0,
    //   username: '',
    //   password: '',
    //   database: '',
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
