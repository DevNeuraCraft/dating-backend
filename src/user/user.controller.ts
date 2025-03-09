import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { IResponseUser } from './types/response-user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Находит пользователя по Telegram ID.
   * @param id - Telegram ID пользователя (число).
   * @returns Объект с найденным пользователем.
   */
  @Get('/by-tg-id/:id')
  public async findOneByTgId(@Param('id') id: number): Promise<IResponseUser> {
    return await this.userService.findOneByTgId(id);
  }

  /**
   * Находит пользователя по MongoDB ObjectId.
   * @param id - ObjectId пользователя (строка).
   * @returns Объект с найденным пользователем.
   */
  @Get('/by-id/:id')
  public async findOneById(@Param('id') id: string): Promise<IResponseUser> {
    return await this.userService.findOneById(id);
  }

  /**
   * Создает нового пользователя с загрузкой изображений.
   * @param createUserDto - Данные для создания пользователя.
   * @param files - Массив загруженных файлов (изображений).
   * @returns Объект с созданным пользователем.
   */
  @UseInterceptors(FilesInterceptor('images', 3))
  @Post()
  public async createUser(
    @Body(new ValidationPipe())
    createUserDto: CreateUserDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^(image)\// }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
        ],
        fileIsRequired: true,
      }),
    )
    files: Express.Multer.File[],
  ): Promise<IResponseUser> {
    const updatedDto = { ...createUserDto, images: files };

    return this.userService.createOne(updatedDto);
  }
}
