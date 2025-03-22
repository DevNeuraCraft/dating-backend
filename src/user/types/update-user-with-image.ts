import { UpdateUserDto } from '../dto/update-user.dto';

export type UpdateUserWithImage = UpdateUserDto & {
  images: Express.Multer.File[];
} & { objectId: string };
