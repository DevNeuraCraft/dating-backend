import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { SearchSwipeDto } from './dto/searc-swipes.dto';
import { SwipeService } from './swipe.service';
import {
  IResponseSwipe,
  IResponseSwipes,
} from './types/response-swipe.interface';

@Controller('swipe')
export class SwipeController {
  constructor(private readonly swipeService: SwipeService) {}

  @Get()
  public async findAll(
    @Query() searchSwipeDto: SearchSwipeDto,
  ): Promise<IResponseSwipes> {
    return await this.swipeService.findAll(searchSwipeDto);
  }

  @Post()
  public async createOne(
    @Body() createSwipeDto: CreateSwipeDto,
  ): Promise<IResponseSwipe> {
    return await this.swipeService.createSwipe(createSwipeDto);
  }
}
