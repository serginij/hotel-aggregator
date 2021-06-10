import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from 'src/utils/utils.module';
import { UserController } from './controller/user.controller';
import { UserService } from './core/user.service';
import { User } from './model/user.model';
import { UserStore } from './store/user.store';

@Module({
  imports: [
    PassportModule,
    UtilsModule,
    TypeOrmModule.forFeature([User, UserStore]),
  ],
  controllers: [UserController],
  providers: [UserService, UserStore],
  exports: [UserService],
})
export class UserModule {}
