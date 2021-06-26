import {
  ForbiddenException,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { ID, RoleEnum } from 'src/common/common.types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SupportRequestClientService } from '../core/support-request-client.service';
import { SupportRequestEmployeeService } from '../core/support-request-employee.service';
import { SupportRequestService } from '../core/support-request.service';
import { SubscribeToChatDto } from '../dto/support-message.dto';
import { TBaseMessageInfo } from '../interface/support-message.interface';

@WebSocketGateway()
export class SupportRequestGateway {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('subscribeToChat')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.CLIENT)
  async subscribeToChat(@MessageBody() data: SubscribeToChatDto, @Req() req) {
    const user = req.user;

    console.log(user);

    const { chatId } = data;

    // TODO: check user aceess if ROLE === CLIENT
    if (user.role === RoleEnum.CLIENT) {
      const hasAccess = await this.supportRequestClientService.checkUserAccess({
        userId: user.id,
        supportRequest: data.chatId,
      });

      if (!hasAccess) throw new ForbiddenException();
    }
    const newMessageHandler = (
      supportRequest: ID,
      message: TBaseMessageInfo,
    ) => {
      if (supportRequest === chatId) {
        this.server.emit('sendMesage', message);
      }
    };
    this.supportRequestService.subscribe(newMessageHandler);
  }
}
