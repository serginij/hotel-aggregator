import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor(private readonly configService: ConfigService) {}

  private saltRounds: number = +(this.configService.get('SALT_ROUNDS') || '3');

  encryptPassword = (password: string) =>
    bcrypt.hash(password, this.saltRounds);

  decryptPassword = (hash: string, password: string) =>
    bcrypt.compare(password, hash);
}
