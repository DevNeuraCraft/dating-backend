import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  private readonly queue: string;

  constructor(
    @Inject('ORDER_SERVICE') private readonly client: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.queue = configService.getOrThrow('RABBITMQ_QUEUE');
  }

  public sendSwipeToOrder(swiperId: string, swipedTgId: string | number): void {
    this.client.emit(this.queue, { swiperId, swipedTgId });
  }
}
