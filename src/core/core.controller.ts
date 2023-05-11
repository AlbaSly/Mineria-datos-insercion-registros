import { Controller, Get } from '@nestjs/common';
import { CoreService } from './core.service';

/**
 * Clase Controller para las peticiones del módulo Core
 */
@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  /**
   * Método GET para la generación e inserción de los datos
   * @returns 
   */
  @Get('gen-data')
  async generateData() {
    return this.coreService.generateData();
  }
}
