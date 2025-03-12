import { IsNotEmpty, IsEnum, IsMongoId } from 'class-validator';

import { SwipeStatus } from '../enum/swipe-status.enum';
import { SwipeType } from '../enum/swipe-type.enum';

export class CreateSwipeDto {
  @IsNotEmpty()
  @IsMongoId()
  swiper_id: string;

  @IsNotEmpty()
  @IsMongoId()
  swiped_id: string;

  @IsNotEmpty()
  @IsEnum(SwipeType)
  swipe_type: SwipeType;

  @IsEnum(SwipeStatus)
  status?: SwipeStatus = SwipeStatus.IGNORED;
}
