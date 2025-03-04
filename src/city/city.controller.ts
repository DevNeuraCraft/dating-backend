import { Controller, Get } from '@nestjs/common';
import { City } from './city.schema';
import { CityService } from './city.service';

@Controller()
export class CityController {
    constructor(private readonly cityService: CityService){}

    @Get('cities')
    public async findAll(): Promise<City[]>{
        return await this.cityService.findAll();
    }
}
