import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { SearchSwipeDto } from './dto/searc-swipes.dto';
import { Swipe, SwipeDocument } from './swipe.schema';
import {
  IResponseSwipe,
  IResponseSwipes,
} from './types/response-swipe.interface';

@Injectable()
export class SwipeService {
  constructor(
    @InjectModel(Swipe.name) private readonly swipeModel: Model<SwipeDocument>,
  ) {}

  public async findAll(
    searchSwipeDto: SearchSwipeDto,
  ): Promise<IResponseSwipes> {
    const { id, page } = searchSwipeDto;
    const limit = 10;
    const skip = (page - 1) * limit;

    const swipes = await this.swipeModel
      .find({ swiper_id: id })
      .skip(skip)
      .limit(limit)
      .populate('swiped_id')
      .populate('swiper_id');

    return { swipes };
  }

  public async createSwipe(
    createSwipeDto: CreateSwipeDto,
  ): Promise<IResponseSwipe> {
    const swipe = await this.swipeModel.create(createSwipeDto);
    return { swipe };
  }
}
