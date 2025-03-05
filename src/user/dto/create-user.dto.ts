import * as Joi from 'joi';

export class CreateUserDto {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;

  static schema = Joi.object({
    id: Joi.string().required(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().allow('').optional(),
    username: Joi.string().allow('').optional(),
    language_code: Joi.string().optional(),
    name: Joi.string().required(),
    about: Joi.string().required(),
    birthYear: Joi.number().min(1900).max(new Date().getFullYear()).required(),
    city: Joi.string().required(),
    gender: Joi.string().valid('male', 'female').required(),
  });
}
