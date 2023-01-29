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
  DocumentSnapshot,
  DocumentData,
  getDoc,
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

export const parseUser = async (
  userFirebase: DocumentSnapshot<DocumentData>,
): Promise<User> => {
  const userDb = {
    id: userFirebase.id,
    ...userFirebase.data(),
  } as any;

  const service = new GameService();

  const likedGames = await Promise.all(
    userDb.likedGames.map(async (likedGame) => {
      return await service.getGameDetails(likedGame);
    }),
  );

  const wishlistedGames = await Promise.all(
    userDb.wishlistedGames.map(async (wishlistedGame) => {
      return await service.getGameDetails(wishlistedGame);
    }),
  );

  return {
    ...userDb,
    likedGames,
    wishlistedGames,
  } as User;
};

/**
 * Get all the users from database
 * @returns
 */
export const getUsers = async (): Promise<User[]> => {
  const usersFirebase = await getDocs(collection(db, 'users'));

  return await Promise.all(
    usersFirebase.docs.map(async (doc) => {
      return await parseUser(doc);
    }),
  );
};

/**
 * Get a user by id from database
 * @returns
 */
export const getUserById = async (id: string): Promise<User> => {
  const userFirebase = await getDoc(doc(db, 'users', id));

  return await parseUser(userFirebase);
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
    return Promise.reject('User failed to be created');
  }
  return Promise.resolve(newUser);
};

/**
 * Add a liked game in database
 * @param id : user id
 * @param gameId : game id
 */
export const addLike = async (id: string, gameId: string): Promise<User> => {
  await updateDoc(doc(db, `users/${id}`), {
    likedGames: arrayUnion(gameId),
  });

  const newUser = await getUserById(id);
  return Promise.resolve(newUser);
};

/**
 * Remove a liked game in database
 * @param id : user id
 * @param gameId : game id
 */
export const removeLike = async (id: string, gameId: string): Promise<User> => {
  await updateDoc(doc(db, `users/${id}`), {
    likedGames: arrayRemove(gameId),
  });

  // verification
  const newUser = await getUserById(id);
  return Promise.resolve(newUser);
};

/**
 * Add a wishlisted game in database
 * @param id : user id
 * @param gameId : game id
 */
export const addWishlist = async (
  id: string,
  gameId: string,
): Promise<User> => {
  await updateDoc(doc(db, `users/${id}`), {
    wishlistedGames: arrayUnion(gameId),
  });

  // verification
  const newUser = await getUserById(id);
  return Promise.resolve(newUser);
};

/**
 * Remove a wishlisted game in database
 * @param id : user id
 * @param gameId : game id
 */
export const removeWishlist = async (
  id: string,
  gameId: string,
): Promise<User> => {
  await updateDoc(doc(db, `users/${id}`), {
    wishlistedGames: arrayRemove(gameId),
  });

  // verification
  const newUser = await getUserById(id);
  return Promise.resolve(newUser);
};

/**
 * Change password for a user in database
 * @param id : user id
 * @param newPassword : new password
 */
export const changePassword = async (
  id: string,
  newPassword: string,
): Promise<User> => {
  await updateDoc(doc(db, `users/${id}`), {
    password: newPassword,
  });

  // verification
  const newUser = await getUserById(id);
  return Promise.resolve(newUser);
}
