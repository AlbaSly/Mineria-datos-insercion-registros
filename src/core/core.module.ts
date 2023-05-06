import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciudades } from '../db/airbus_380_acad/entities/Ciudades';
import { Aerolineas } from 'src/db/airbus_380_acad/entities/Aerolineas';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ciudades])
  ],
  controllers: [CoreController],
  providers: [CoreService]
})
export class CoreModule {}
