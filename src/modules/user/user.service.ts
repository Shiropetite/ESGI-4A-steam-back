import { Injectable } from '@nestjs/common';
import { createUser, getUsers } from '../../data/firebase'
import { User } from './user.entity';

@Injectable()
export class UserService {
  async signIn(email: string, password: string): Promise<User> {
    const users = await getUsers();
    for (let user of users) {
      if (user.email === email && user.password === password) { return user; }
    }
    return null;
  }

  async signUp(newUser: User): Promise<void> {
    await createUser(newUser);
  }
}

