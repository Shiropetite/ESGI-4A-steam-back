// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { User } from './../modules/user/user.entity';

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
  return (await getDocs(collection(db, 'users'))).docs.map((doc) => ({id: doc.id, ...doc.data()}) as User);
};

export const createUser = async (user: User): Promise<void> => {
  await setDoc(doc(collection(db, 'users')), {
    ...user
  });
}
