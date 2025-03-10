import { City, CitySchema } from 'src/city/city.schema';
import { S3Module } from 'src/s3/s3.module';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: City.name, schema: CitySchema },
    ]),
    S3Module,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}