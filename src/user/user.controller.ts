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
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserValidationPipe } from './pipes/user.validation.pipe';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(FilesInterceptor('images', 3))
  @Post()
  public async createUser(
    @Body(new UserValidationPipe(CreateUserDto.schema))
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
  ): Promise<any> {
    const updatedDto = { ...createUserDto, images: files };

    return this.userService.createOne(updatedDto);
  }
}
