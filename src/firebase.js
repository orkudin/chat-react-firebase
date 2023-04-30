// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqCRUVt5i4k5yEipmsbbnMuwnmnc09mDY",
  authDomain: "chat-react-8498e.firebaseapp.com",
  projectId: "chat-react-8498e",
  storageBucket: "chat-react-8498e.appspot.com",
  messagingSenderId: "788141824325",
  appId: "1:788141824325:web:87ea19e3eee2c65355462c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app
export const db = getFirestore(app)