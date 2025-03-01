import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value)) 
  id: number;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  language_code?: string;
}