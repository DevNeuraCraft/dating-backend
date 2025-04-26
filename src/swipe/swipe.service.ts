import { Model } from 'mongoose';
import { OrdersService } from 'src/orders/orders.service';
import { UserService } from 'src/user/user.service';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { SearchSwipeDto } from './dto/search-swipes.dto';
import { SwipeType } from './enum/swipe-type.enum';
import { Swipe, SwipeDocument } from './swipe.schema';
import {
  IResponseSwipe,
  IResponseSwipes,
} from './types/response-swipe.interface';
import { SearchOneSwipeDto } from './dto/search-one-swipe.dto';
import { UpdateSwipeDto } from './dto/update-swipe.dto';
import { ActionType } from '../orders/emun/action-type.enum';
import { SwipeStatus } from './enum/swipe-status.enum';

@Injectable()
export class SwipeService {
  constructor(
    @InjectModel(Swipe.name) private readonly swipeModel: Model<SwipeDocument>,
    private readonly orderService: OrdersService,
    private readonly userService: UserService
  ) {}

  public async findOne(
    searchOneSwipeDto: SearchOneSwipeDto
  ): Promise<IResponseSwipe> {
    const swipe = await this.swipeModel
      .findOne({
        $or: [
          {
            swiper_id: searchOneSwipeDto.swiperId,
            swiped_id: searchOneSwipeDto.swipedId,
          },
          {
            swiper_id: searchOneSwipeDto.swipedId,
            swiped_id: searchOneSwipeDto.swiperId,
          },
        ],
      })
      .populate('swiped_id')
      .populate('swiper_id');
    return { swipe: swipe };
  }

  public async findAll(
    searchSwipeDto: SearchSwipeDto
  ): Promise<IResponseSwipes> {
    const { id, page } = searchSwipeDto;
    const limit = 10;
    const skip = (page - 1) * limit;

    const swipes = await this.swipeModel
      .find({ swiper_id: id, swipe_type: { $ne: SwipeType.REJECT } })
      .skip(skip)
      .limit(limit)
      .populate('swiped_id')
      .populate('swiper_id')
      .sort({ createdAt: -1 });

    return { swipes };
  }

  public async createSwipe(
    createSwipeDto: CreateSwipeDto
  ): Promise<IResponseSwipe> {
    const existingSwipe = await this.swipeModel.findOne({
      $or: [
        {
          swiper_id: createSwipeDto.swiper_id,
          swiped_id: createSwipeDto.swiped_id,
        },
        {
          swiper_id: createSwipeDto.swiped_id,
          swiped_id: createSwipeDto.swiper_id,
        },
      ],
    });

    // if (existingSwipe) {
    //   return { swipe: existingSwipe };
    // }

    const swipe = await this.swipeModel.create(createSwipeDto);
    if (createSwipeDto.swipe_type === SwipeType.ACCEPT) {
      const { user: swipedUser } = await this.userService.findOneById(
        createSwipeDto.swiped_id
      );
      if (swipedUser) {
        this.orderService.sendSwipeToOrder(
          ActionType.NEW_SWIPE,
          createSwipeDto.swiper_id,
          swipedUser.id
        );
      }
    }
    return { swipe };
  }

  public async updateOne(
    updateSwipeDto: UpdateSwipeDto
  ): Promise<IResponseSwipe> {
    const { swipe } = await this.findOne({
      swiperId: updateSwipeDto.swiper_id,
      swipedId: updateSwipeDto.swiped_id,
    });
    if (!swipe)
      throw new HttpException(
        'This swipe does not exists',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    const updateSwipe = await this.swipeModel.findOneAndUpdate(
      {
        swiper_id: updateSwipeDto.swiper_id,
        swiped_id: updateSwipeDto.swiped_id,
      },
      { status: updateSwipeDto.status },
      { new: true }
    );
    if (updateSwipeDto.status === SwipeStatus.ACCEPTED) {
      const { user: swiperUser } = await this.userService.findOneById(
        updateSwipeDto.swiper_id
      );
      if (swiperUser) {
        this.orderService.sendSwipeToOrder(
          ActionType.POS_RESPONSE,
          updateSwipeDto.swiper_id,
          swiperUser.id
        );
      }
    }

    return { swipe: updateSwipe };
  }
}
