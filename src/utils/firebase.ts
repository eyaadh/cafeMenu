import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_LOCAL_API_KEY as string,
  authDomain: import.meta.env.VITE_LOCAL_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_LOCAL_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_LOCAL_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_LOCAL_MESSAGE_SENDER_ID as string,
  appId: import.meta.env.VITE_LOCAL_APP_ID as string,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
