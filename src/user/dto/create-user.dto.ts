import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

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

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  birthYear: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsIn(['male', 'female'])
  gender: string;
}