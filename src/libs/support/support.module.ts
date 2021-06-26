import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportRequestController } from './controller/support-request.controller';
import { SupportRequestClientService } from './core/support-request-client.service';
import { SupportRequestEmployeeService } from './core/support-request-employee.service';
import { SupportRequestService } from './core/support-request.service';
import { SupportMessage } from './model/support-message.model';
import { SupportRequest } from './model/support-request.model';
import { SupportMessageStore } from './store/support-message.store';
import { SupportRequestStore } from './store/support-request.store';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportRequest, SupportMessage]),
    PassportModule,
  ],
  controllers: [SupportRequestController],
  providers: [
    SupportRequestService,
    SupportRequestEmployeeService,
    SupportRequestClientService,
    SupportRequestStore,
    SupportMessageStore,
  ],
})
export class SupportModule {}
