import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SearchOneSwipeDto {
  @IsNotEmpty()
  @IsMongoId()
  swiperId: string;

  @IsNotEmpty()
  @IsMongoId()
  swipedId: string;
}
