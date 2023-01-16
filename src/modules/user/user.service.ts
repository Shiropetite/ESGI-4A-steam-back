import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  createUser,
  getUsers,
  addLike,
  removeLike,
  addWishlist,
  removeWishlist,
} from '../../data/firebase';
import { User } from './user.entity';

@Injectable()
export class UserService {
  /**
   * Sign in a user
   * @param email
   * @param password
   * @returns
   */
  async signIn(email: string, password: string): Promise<User> {
    const users = await getUsers();
    for (const user of users) {
      if (user.email === email && user.password === password) {
        return user;
      }
    }
    throw new HttpException("User don't exist", HttpStatus.BAD_REQUEST);
  }

  /**
   * Sign up
   * @param newUser
   * @returns
   */
  async signUp(newUser: User): Promise<User> {
    const users = await getUsers();
    const sameUser = users.find((u) => u.email === newUser.email);

    if (sameUser) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }
    return await createUser(newUser);
  }

  /**
   * Add a game to the like
   * @param id - user id
   * @param idGame - game id
   */
  async like(id: string, idGame: string): Promise<void> {
    await addLike(id, idGame);
  }

  /**
   * Remove a game to the like
   * @param id - user id
   * @param idGame - game id
   */
  async unlike(id: string, idGame: string): Promise<void> {
    await removeLike(id, idGame);
  }

  /**
   * Add a game to the wishlist
   * @param id - user id
   * @param idGame - game id
   */
  async wishlist(id: string, idGame: string): Promise<void> {
    await addWishlist(id, idGame);
  }

  /**
   * Remove a game to the wishlist
   * @param id - user id
   * @param idGame - game id
   */
  async unwishlist(id: string, idGame: string): Promise<void> {
    await removeWishlist(id, idGame);
  }
}
