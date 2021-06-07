import { Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';

const saltRounds: number = +(process.env.SALT_ROUNDS || '3');

@Injectable()
export class BcryptService {
  encryptPassword = (password: string) => bcrypt.hash(password, saltRounds);

  decryptPassword = (hash: string, password: string) =>
    bcrypt.compare(password, hash);
}
