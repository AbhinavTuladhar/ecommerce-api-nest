import { IsEnum, IsNotEmpty } from 'class-validator';

import { OrderStatus } from 'src/entities/order.entity';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}