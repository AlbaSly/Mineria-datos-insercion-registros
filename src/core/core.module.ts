import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { airbus380acadEntitites } from 'src/db/airbus_380_acad/entities';
import { CoreHelperService } from './helpers/index.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(airbus380acadEntitites)
  ],
  controllers: [CoreController],
  providers: [CoreService, CoreHelperService]
})
export class CoreModule {}
