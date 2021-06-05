import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/user.model';
import { UserStore } from './store/user.store';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserStore])],
})
export class UserModule {}
