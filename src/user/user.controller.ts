import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IResponseEplores } from './types/respone-explore.inreface';
import { IResponseUser } from './types/response-user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
  DEV
  */

  @Get('migrate-test')
  public async migrate() {
    await this.userService.migrate();
  }

  /**
   * Находит пользователя по Telegram ID.
   * @param id - Telegram ID пользователя (число).
   * @returns Объект с найденным пользователем.
   */
  @Get('by-tg-id/:id')
  public async findOneByTgId(@Param('id') id: number): Promise<IResponseUser> {
    return await this.userService.findOneByTgId(id);
  }

  /**
   * Находит пользователя по MongoDB ObjectId.
   * @param id - ObjectId пользователя (строка).
   * @returns Объект с найденным пользователем.
   */
  @Get('by-id/:id')
  public async findOneById(@Param('id') id: string): Promise<IResponseUser> {
    return await this.userService.findOneById(id);
  }

  /**
   * Поиска пользователей противоположного пола в том же городе, что и текущий пользователь.
   * @param {string} id - ID пользователя, для которого выполняется поиск.
   * @returns {Promise<IResponseEplores>} - Объект с массивом найденных пользователей.
   */
  @Get('find-explores/:id')
  public async findExplores(
    @Param('id') id: string,
  ): Promise<IResponseEplores> {
    return await this.userService.findExplores(id);
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

  @UseInterceptors(FilesInterceptor('images', 3))
  @Put(':id')
  public async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^(image)\// }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Express.Multer.File[],
  ): Promise<IResponseUser> {
    return await this.userService.updateOne({
      objectId: id,
      ...updateUserDto,
      images: files,
    });
  }
}