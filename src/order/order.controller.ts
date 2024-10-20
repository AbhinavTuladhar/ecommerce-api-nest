import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('/:id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Patch('/:id')
  updateStatus(
    @Body() dto: UpdateOrderStatusDto,
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    return this.orderService.updateStatus(id, dto);
  }

  @Delete('/:id')
  deleteOrder(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderService.deleteOrder(id);
  }
}
