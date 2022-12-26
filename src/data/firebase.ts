// Import the functions you need from the SDKs you need
import { HttpException, HttpStatus } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from 'firebase/firestore';
import { User } from './../modules/user/user.entity';
import { GameService } from './../modules/game/game.service';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
