import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './libs/user/user.module';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './libs/auth/auth.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(), UtilsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
