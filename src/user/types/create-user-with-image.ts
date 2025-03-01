import { CreateUserDto } from '../dto/create-user.dto';

export type CreateUserWithImage = CreateUserDto & { images: Express.Multer.File[] };
