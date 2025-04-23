import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { City, CityDocument } from './city.schema';
import { citiesData } from './city.data';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name) private readonly cityModel: Model<CityDocument>
  ) {}

  public async findAll(): Promise<City[]> {
    return this.cityModel.find();
  }

  public async migrate(): Promise<void> {
    const cityCount = await this.cityModel.countDocuments();
    if (cityCount === 0) {
      await this.cityModel.insertMany(citiesData);
    }
  }
}
