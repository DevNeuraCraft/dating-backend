import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class SearchSwipeDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsNumber()
  @Min(1)
  page: number = 1;
}
