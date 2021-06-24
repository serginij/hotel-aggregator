import { Injectable } from '@nestjs/common';

interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
  closeRequest(supportRequest: ID): Promise<void>;
}

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService {}
