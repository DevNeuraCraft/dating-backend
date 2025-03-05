import { ObjectSchema } from 'joi';

import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';

export class UserValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value, {
      abortEarly: false,
    });
    if (error) {
      throw new HttpException(error.details[0].message, HttpStatus.BAD_REQUEST);
    }

    return value;
  }
}
