import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from 'src/utils/utils.module';
import { UserController } from './controller/user.controller';
import { UserService } from './core/user.service';
import { User } from './model/user.model';
import { UserStore } from './store/user.store';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([User, UserStore])],
  providers: [UserController, UserService],
  exports: [UserService],
})
export class UserModule {}
