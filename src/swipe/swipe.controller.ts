import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { SearchSwipeDto } from './dto/search-swipes.dto';
import { SwipeService } from './swipe.service';
import {
  IResponseSwipe,
  IResponseSwipes,
} from './types/response-swipe.interface';
import { SearchOneSwipeDto } from './dto/search-one-swipe.dto';
import { UpdateSwipeDto } from './dto/update-swipe.dto';

@Controller()
export class SwipeController {
  constructor(private readonly swipeService: SwipeService) {}

  @Get('swipes')
  public async findAll(
    @Query() searchSwipeDto: SearchSwipeDto,
  ): Promise<IResponseSwipes> {
    return await this.swipeService.findAll(searchSwipeDto);
  }

  @Get('swipe')
  public async findOne(
    @Query() searchSwipeDto: SearchOneSwipeDto,
  ): Promise<IResponseSwipe> {
    return await this.swipeService.findOne(searchSwipeDto);
  }

  @Post('swipe')
  public async createOne(
    @Body() createSwipeDto: CreateSwipeDto,
  ): Promise<IResponseSwipe> {
    return await this.swipeService.createSwipe(createSwipeDto);
  }

  @Put('swipe')
  public async updateOne(
    @Body() updateSwipeDto: UpdateSwipeDto,
  ): Promise<IResponseSwipe> {
    return await this.swipeService.updateOne(updateSwipeDto);
  }
}
