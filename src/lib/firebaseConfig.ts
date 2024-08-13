import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsCv91N8MbRAoa3NDokjUQlZ0rqpVrdeg",
  authDomain: "chirp-c7281.firebaseapp.com",
  projectId: "chirp-c7281",
  storageBucket: "chirp-c7281.appspot.com",
  messagingSenderId: "304729634083",
  appId: "1:304729634083:web:067f12e4ed66c5a105c896"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };