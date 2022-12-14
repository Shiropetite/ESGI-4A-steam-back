// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

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

const getGames = async (db) => {
  const gamesCollection = collection(db, 'games');
  const gamesSnapshot = await getDocs(gamesCollection);
  return gamesSnapshot.docs.map((doc) => doc.data());
};
