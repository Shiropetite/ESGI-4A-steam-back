import { Injectable } from '@nestjs/common';
import {
  createUser,
  getUsers,
  addLike,
  removeLike,
  addWishlist,
  removeWishlist,
  changePassword,
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
    const newUser = await this.findUserByEmail(email);
    if (!newUser) { return Promise.reject("User doesn't exist"); }
    return newUser;
  }

  /**
   * Sign up
   * @param newUser
   * @returns
   */
  async signUp(newUser: User): Promise<User> {
    const sameUser = await this.findUserByEmail(newUser.email)
    if (sameUser) { return Promise.reject('User already exist'); }
    return await createUser(newUser);
  }

  /**
   * Change user password
   * @param id - user id
   * @param idGame - game id
   */
  async changePassword(email: string, newPassword: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (!user) { return Promise.reject("User doesn't exist"); }
    return await changePassword(user.id, newPassword);
  }

  /**
   * Add a game to the like
   * @param id - user id
   * @param idGame - game id
   */
  async like(id: string, idGame: string): Promise<User> {
    return await addLike(id, idGame);
  }

  /**
   * Remove a game to the like
   * @param id - user id
   * @param idGame - game id
   */
  async unlike(id: string, idGame: string): Promise<User> {
    return await removeLike(id, idGame);
  }

  /**
   * Add a game to the wishlist
   * @param id - user id
   * @param idGame - game id
   */
  async wishlist(id: string, idGame: string): Promise<User> {
    return await addWishlist(id, idGame);
  }

  /**
   * Remove a game to the wishlist
   * @param id - user id
   * @param idGame - game id
   */
  async unwishlist(id: string, idGame: string): Promise<User> {
    return await removeWishlist(id, idGame);
  }

  async findUserByEmail(email: string): Promise<User> {
    return (await getUsers()).find((user) => user.email === email);
  }
}
