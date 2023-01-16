import { HttpException, HttpStatus } from '@nestjs/common';

// Firebase
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

// Modules
import { User } from './../modules/user/user.entity';
import { GameService } from './../modules/game/game.service';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB-FwV0TsbBGQoMXv_NvKpZ9WXSxuYvMEI',
  authDomain: 'esgi-android-steam-app.firebaseapp.com',
  projectId: 'esgi-android-steam-app',
  storageBucket: 'esgi-android-steam-app.appspot.com',
  messagingSenderId: '691196008887',
  appId: '1:691196008887:web:9647b3d24462a94e7a7032',
  measurementId: 'G-HEQS8EKGYM',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Get all the users from database
 * @returns
 */
export const getUsers = async (): Promise<User[]> => {
  const userDb = (await getDocs(collection(db, 'users'))).docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as any),
  );

  const service = new GameService();

  const user = await Promise.all(
    userDb.map(async (u) => {
      const newUser = u;
      newUser.likedGames = await Promise.all(
        newUser.likedGames.map(async (likedGame) => {
          return await service.getGameById(likedGame);
        }),
      );
      newUser.wishlistedGames = await Promise.all(
        newUser.wishlistedGames.map(async (wishlistedGame) => {
          return await service.getGameById(wishlistedGame);
        }),
      );
      return newUser;
    }),
  );
  return user;
};

/**
 * Create a user in database
 * @param user : new user
 * @returns
 */
export const createUser = async (user: User): Promise<User> => {
  await setDoc(doc(collection(db, 'users')), {
    ...user,
    likedGames: [],
    wishlistedGames: [],
  });

  // verification
  const newUser = (await getUsers()).find((u) => u.email === user.email);
  if (newUser === undefined) {
    throw new HttpException(
      'User failed to be created',
      HttpStatus.BAD_REQUEST,
    );
  }
  return Promise.resolve(newUser);
};

/**
 * Add a liked game in database
 * @param id : user id
 * @param gameId : game id
 */
export const addLike = async (id: string, gameId: string): Promise<void> => {
  await updateDoc(doc(db, `users/${id}`), {
    likedGames: arrayUnion(gameId),
  });
};

/**
 * Remove a liked game in database
 * @param id : user id
 * @param gameId : game id
 */
export const removeLike = async (id: string, gameId: string): Promise<void> => {
  await updateDoc(doc(db, `users/${id}`), {
    likedGames: arrayRemove(gameId),
  });
};

/**
 * Add a wishlisted game in database
 * @param id : user id
 * @param gameId : game id
 */
export const addWishlist = async (
  id: string,
  gameId: string,
): Promise<void> => {
  await updateDoc(doc(db, `users/${id}`), {
    wishlistedGames: arrayUnion(gameId),
  });
};

/**
 * Remove a wishlisted game in database
 * @param id : user id
 * @param gameId : game id
 */
export const removeWishlist = async (
  id: string,
  gameId: string,
): Promise<void> => {
  await updateDoc(doc(db, `users/${id}`), {
    wishlistedGames: arrayRemove(gameId),
  });
};
