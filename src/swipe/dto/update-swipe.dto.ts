import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

import { SwipeStatus } from '../enum/swipe-status.enum';

export class UpdateSwipeDto {
  @IsNotEmpty()
  @IsMongoId()
  swiper_id: string;

  @IsNotEmpty()
  @IsMongoId()
  swiped_id: string;

  @IsNotEmpty()
  @IsEnum(SwipeStatus)
  status: SwipeStatus;
}
