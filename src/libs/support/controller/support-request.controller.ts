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
  Put,
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
export class SupportRequestController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @Roles(RoleEnum.CLIENT)
  @Post()
  @UsePipes(new ValidationPipe())
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
  @UsePipes(new ValidationPipe({ transform: true }))
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
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSupportManagerRequests(@Query() params: SearchSupportRequestDto) {
    return await this.supportRequestService.findSupportRequests(params);
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.CLIENT)
  // @Roles(RoleEnum.CLIENT)
  @Get('/:id/messages')
  async getSupportRequestMessages(@Param('id') id, @Req() req) {
    const user = req.user;

    console.log(user);

    // TODO: check user aceess if ROLE === CLIENT
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
  // @Roles(RoleEnum.CLIENT)
  @Post('/:id/messages')
  @UsePipes(new ValidationPipe())
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
  // REQUIRED
  // READ MESSAGES - manager & client
  @Roles(RoleEnum.MANAGER, RoleEnum.CLIENT)
  // @Roles(RoleEnum.CLIENT)
  @Post('/:id/messages/read')
  @UsePipes(new ValidationPipe())
  async markMessagesAsRead(
    @Param('id') id,
    @Body() data: MarkMessagesAsReadDto,
    @Req() req,
  ) {
    const user = req.user;
    const isManager = user.role === RoleEnum.MANAGER;

    if (isManager && !data.user)
      throw new BadRequestException('No user ID was provided');

    if (isManager) {
      return await this.supportRequestEmployeeService.markMessagesAsRead({
        ...data,
        supportRequest: id,
      } as IMarkMessagesAsRead);
    } else {
      return await this.supportRequestClientService.markMessagesAsRead({
        ...data,
        userId: user?.id,
        supportRequest: id,
      });
    }
  }

  // REQUIRED
  // SUBSCRIBE TO CHAT - manager & client

  // GET UNREAD COUNT - manager & client

  // CLOSE REQUEST - manager
}
