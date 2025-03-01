import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor('images', 3))
  @Post()
  public async createUser(
    @Body('user') createUserDto: CreateUserDto,
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
  ): Promise<any> {
    const updatedDto = { ...createUserDto, images: files };

    return this.userService.createOne(updatedDto);
  }
}
