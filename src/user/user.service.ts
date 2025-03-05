import { Model } from 'mongoose';
import { S3Service } from 'src/s3/s3.service';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserWithImage } from './types/create-user-with-image';
import { IResponseUser } from './types/response-user.interface';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // Используем userModel вместо UserModel
  ) {}

  /**
   * Создает  пользователя.
   * @param createUserDto - Данные для создания или обновления пользователя.
   * @returns Обновленный или созданный пользователь.
   */
  public async createOne(
    createUserDto: CreateUserWithImage,
  ): Promise<IResponseUser> {
    const { images, ...rest } = createUserDto;
    const imagesUrl = await this.s3Service.uploadMultipleFiles(images);

    const updatedDto = { ...rest, images: imagesUrl };

    const user = await this.userModel.findOneAndUpdate(
      { id: updatedDto.id },
      { ...updatedDto },
      { new: true, upsert: true },
    );

    return { user };
  }
}
