import { isValidObjectId, Model } from 'mongoose';
import { S3Service } from 'src/s3/s3.service';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gender } from './enum/gender.enum';
import { CreateUserWithImage } from './types/create-user-with-image';
import { IResponseEplores } from './types/respone-explore.inreface';
import { IResponseUser } from './types/response-user.interface';
import { UpdateUserWithImage } from './types/update-user-with-image';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

  public async getAllCount(): Promise<number> {
    return await this.userModel.countDocuments();
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
   * @param id string - пользователя (строка).
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
   * Обновляет данные пользователя, включая основную информацию и изображения.
   * @param {UpdateUserWithImage} updateUserDto - DTO с данными для обновления:
   *   - objectId: string - ID пользователя
   *   - images: string[] - Массив новых изображений
   *   - existsImages: string[] - Массив существующих изображений для сохранения
   *   - birthYear?: number - Год рождения для пересчёта возраста
   *   - ...otherFields: any - Другие обновляемые поля пользователя
   * @returns {Promise<IResponseUser>} - Объект с обновлёнными данными пользователя.
   * @throws {HttpException} - В случаях:
   *   - Пользователь не найден (404)
   *   - Ошибка обновления изображений (500)
   *   - Ошибка сохранения данных пользователя (500)
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

  public async updateOne(
    updateUserDto: UpdateUserWithImage,
  ): Promise<IResponseUser> {
    const { objectId, images, ...rest } = updateUserDto;
    const { user } = await this.findOneById(objectId);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const newImagesUrl = [...user.images];

    if (rest.existsImages && images.length > 0) {
      try {
        const imagesUrlToDelete = user.images.filter(
          (image) => !rest.existsImages!.includes(image),
        );

        // Индексы изменённых изображений
        const indexes = imagesUrlToDelete
          .map((image) => user.images.indexOf(image))
          .filter((index) => index !== -1);

        // Новые ссылки
        const updatedImagesUrl =
          await this.s3Service.uploadMultipleFiles(images);

        // Удаление старых изображений
        await this.s3Service.deleteMultipleFiles(imagesUrlToDelete);

        // Обновление ссылок на изображения с учётом порядка
        updatedImagesUrl.forEach((imageUrl, i) => {
          if (indexes[i] !== undefined) {
            newImagesUrl[indexes[i]] = imageUrl;
          }
        });
      } catch (err) {
        throw new HttpException(
          'Update image error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: objectId },
      {
        ...rest,
        images: newImagesUrl,
        age: rest.birthYear
          ? new Date().getFullYear() - rest.birthYear
          : user.age,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new HttpException(
        'User update failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { user: updatedUser };
  }

  public async migrate() {
    const names = ['Alina', 'Alisa', 'Ann', 'Alice', 'Jane', 'Nicole', 'Anby'];
    const objs: User[] = [];
    const users = await this.userModel.find();
    const me = users[0];
    names.forEach((name, index) => {
      const user: User = {
        id: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
        about: me.about,
        age: Math.floor(Math.random() * (25 - 16 + 1)) + 16,
        name: name,
        gender: Gender.FEMALE,
        city: 'Саратов',
        images: me.images,
      };

      objs.push(user);

      console.log(user);
    });
    await this.userModel.create(objs);
  }
}