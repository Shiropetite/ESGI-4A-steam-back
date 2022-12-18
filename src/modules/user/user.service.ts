import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createUser, getUsers } from '../../data/firebase'
import { User } from './user.entity';

@Injectable()
export class UserService {
  async signIn(email: string, password: string): Promise<User> {
    const users = await getUsers();
    for (const user of users) {
      if (user.email === email && user.password === password) {
        return user;
      }
    }
    return null;
  }

  async signUp(newUser: User): Promise<User> {
    const users = await getUsers();
    const sameUser = users.find((u) => u.email === newUser.email);

    if (sameUser) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }
    return await createUser(newUser);
  }
}
