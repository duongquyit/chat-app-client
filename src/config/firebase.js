import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDmYZXJUZ5Jplp8PczmNyXq63QpRqrQ79c",
    authDomain: "chat-app-ef492.firebaseapp.com",
    projectId: "chat-app-ef492",
    storageBucket: "chat-app-ef492.appspot.com",
    messagingSenderId: "321153201311",
    appId: "1:321153201311:web:d725e56df4de58f15cdeaa",
    measurementId: "G-CEDWD414GJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }