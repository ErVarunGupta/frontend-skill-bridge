import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZcA3JnoAHKWSSnQ66aPO6pOkkpvQW9f8",
  authDomain: "skill-bridge-98a66.firebaseapp.com",
  projectId: "skill-bridge-98a66",
  storageBucket: "skill-bridge-98a66.firebasestorage.app",
  messagingSenderId: "309356933936",
  appId: "1:309356933936:web:8ae5fa6512931fa7410ef5",
  measurementId: "G-HC4WPSE12J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};