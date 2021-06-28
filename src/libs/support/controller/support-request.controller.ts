import {
  BadRequestException,
  ForbiddenException,
  Param,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
  Get,
  Query,
  UsePipes,
} from '@nestjs/common';
import { RoleEnum } from 'src/common/common.types';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SupportRequestClientService } from '../core/support-request-client.service';
import { SupportRequestEmployeeService } from '../core/support-request-employee.service';

import { SupportRequestService } from '../core/support-request.service';
import {
  MarkMessagesAsReadDto,
  SendMessageDto,
} from '../dto/support-message.dto';
import {
  CreateSupportRequestDto,
  SearchSupportRequestDto,
} from '../dto/support-request.dto';
import { IMarkMessagesAsRead } from '../interface/support-message.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('support-requests')
@UsePipes(new ValidationPipe({ transform: true }))
export class SupportRequestController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @Roles(RoleEnum.CLIENT)
  @Post()
  async createSupportRequest(
    @Body() data: CreateSupportRequestDto,
    @Req() req,
  ) {
    const userId = req?.user?.id;
    const supportRequest =
      await this.supportRequestClientService.createSupportRequest({
        ...data,
        userId,
      });

    if (!supportRequest)
      throw new InternalServerErrorException(
        'An error occured while creating supportRequest',
      );

    return supportRequest;
  }

  @Roles(RoleEnum.CLIENT)
  @Get()
  async getSupportRequests(
    @Query() params: SearchSupportRequestDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return await this.supportRequestService.findSupportRequests({
      ...params,
      userId,
    });
  }

  @Roles(RoleEnum.MANAGER)
  @Get('/manager')
  async getSupportManagerRequests(@Query() params: SearchSupportRequestDto) {
    return await this.supportRequestService.findSupportRequests({
      ...params,
      selectUser: true,
    });
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.CLIENT)
  @Get('/:id/messages')
  async getSupportRequestMessages(@Param('id') id, @Req() req) {
    const user = req.user;

    if (user.role === RoleEnum.CLIENT) {
      const hasAccess = await this.supportRequestClientService.checkUserAccess({
        userId: user.id,
        supportRequest: id,
      });

      if (!hasAccess) throw new ForbiddenException();
    }

    const res = await this.supportRequestService.getMessages(id);

    return res;
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.CLIENT)
  @Post('/:id/messages')
  async sendSupportRequestMessage(
    @Param('id') id,
    @Body() data: SendMessageDto,
    @Req() req,
  ) {
    const userId = req?.user?.id;
    const res = await this.supportRequestService.sendMessage({
      supportRequest: id,
      ...data,
      author: userId,
    });

    return res;
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.CLIENT)
  @Post('/:id/messages/read')
  async markMessagesAsRead(
    @Param('id') id,
    @Body() data: MarkMessagesAsReadDto,
    @Req() req,
  ) {
    const user = req.user;
    const isManager = user.role === RoleEnum.MANAGER;

    if (isManager && !data.userId)
      throw new BadRequestException('No user ID was provided');

    let res;

    if (isManager) {
      res = await this.supportRequestEmployeeService.markMessagesAsRead({
        ...data,
        supportRequest: id,
      } as IMarkMessagesAsRead);
    } else {
      res = await this.supportRequestClientService.markMessagesAsRead({
        ...data,
        userId: user?.id,
        supportRequest: id,
      });
    }

    return { success: res };
  }
}
