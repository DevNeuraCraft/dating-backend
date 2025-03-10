import { isValidObjectId, Model } from 'mongoose';
import { S3Service } from 'src/s3/s3.service';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gender } from './enum/gender.enum';
import { CreateUserWithImage } from './types/create-user-with-image';
import { IResponseEplores } from './types/respone-explore.inreface';
import { IResponseUser } from './types/response-user.interface';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // Используем userModel вместо UserModel
  ) {}

  /**
   * Создает или обновляет пользователя.
   * Если пользователь с указанным `id` уже существует, он будет обновлен.
   * Если пользователь не существует, он будет создан.
   * @param createUserDto - Данные для создания или обновления пользователя, включая изображения.
   * @returns Объект с созданным или обновленным пользователем.
   */
  public async createOne(
    createUserDto: CreateUserWithImage,
  ): Promise<IResponseUser> {
    const { images, ...rest } = createUserDto;
    const imagesUrl = await this.s3Service.uploadMultipleFiles(images);

    const updatedDto = { ...rest, images: imagesUrl };

    const user = await this.userModel.findOneAndUpdate(
      { id: updatedDto.id },
      { ...updatedDto, age: new Date().getFullYear() - updatedDto.birthYear },
      { new: true, upsert: true },
    );

    return { user };
  }

  /**
   * Находит пользователя по Telegram ID.
   * @param id - Telegram ID пользователя (число).
   * @returns Объект с найденным пользователем.
   * @throws HttpException - Если `id` не является числом.
   */
  public async findOneByTgId(id: number): Promise<IResponseUser> {
    if (isNaN(id))
      throw new HttpException('Id must be a number', HttpStatus.BAD_REQUEST);
    const user = await this.userModel.findOne({ id });
    return { user };
  }

  /**
   * Находит пользователя по MongoDB ObjectId.
   * @param id - ObjectId пользователя (строка).
   * @returns Объект с найденным пользователем.
   * @throws HttpException - Если `id` не является валидным ObjectId.
   */
  public async findOneById(id: string): Promise<IResponseUser> {
    if (!isValidObjectId(id))
      throw new HttpException('Id must be a ObjectId', HttpStatus.BAD_REQUEST);
    const user = await this.userModel.findById(id);
    return { user };
  }

  /**
   * Ищет пользователей противоположного пола в том же городе, что и текущий пользователь.
   * @param {string} id - ID пользователя, для которого выполняется поиск.
   * @returns {Promise<IResponseEplores>} - Объект с массивом найденных пользователей.
   * @throws {HttpException} - Если пользователь с указанным ID не найден (404).
   */
  public async findExplores(id: string): Promise<IResponseEplores> {
    const { user } = await this.findOneById(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const oppositeGender =
      user.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
    const explores = await this.userModel
      .find({
        _id: { $ne: id },
        gender: oppositeGender,
        city: user.city,
      })
      .limit(10);
    return { explores };
  }

  public async migrate() {
    const names = ['Alina', 'Alisa', 'Ann', 'Alice', 'Jane', 'Nicole', 'Anby'];
    const objs: User[] = [];
    const users = await this.userModel.find();
    const me = users[0];
    names.forEach((name, index) => {
      const user: User = {
        id: index,
        about: me.about,
        age: Math.floor(Math.random() * (25 - 16 + 1)) + 16,
        name: name,
        gender: Gender.FEMALE,
        city: 'Саратов',
        images: me.images,
      };

      objs.push(user);

      // Сохраняем в базу данных
      console.log(user);
    });
    await this.userModel.create(objs);
  }
}