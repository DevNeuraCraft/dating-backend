import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid4 } from 'uuid';
import { getFileExtension } from 'src/utils/get-file-extension'

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly endPoint: string;
  private readonly filesPath: string;

  constructor(private readonly configService: ConfigService) {
    this.endPoint = this.configService.getOrThrow<string>('AWS_ENDPOINT');
    this.bucketName = this.configService.getOrThrow<string>('AWS_BUCKET_NAME');
    this.filesPath = this.configService.getOrThrow<string>('AWS_PATH');
    this.s3Client = new S3Client({
      endpoint: this.endPoint,
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      forcePathStyle: true,
    });
  }

  private ejectKey(fileUrl: string): string {
    return fileUrl.replace(`${this.endPoint}/${this.bucketName}/`, '');
  }

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    const uuid = uuid4();
    const extension = getFileExtension(file.originalname);
    const key =
      `${this.filesPath}/${uuid}.${extension === 'heic' ? 'png' : extension}`
        .replace(/\s+/g, '')
        .trim();

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `${this.endPoint}/${this.bucketName}/${key}`;
  }

  public async deleteFile(fileUrl: string): Promise<void> {
    const key = this.ejectKey(fileUrl);
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }

  public async uploadMultipleFiles(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const imageUrls = await Promise.all(
      files.map((file) => this.uploadFile(file)),
    );
    return imageUrls;
  }

  public async deleteMultipleFiles(filesUrl: string[]): Promise<void> {
    await Promise.all(filesUrl.map((fileUrl) => this.deleteFile(fileUrl)));
  }
}
