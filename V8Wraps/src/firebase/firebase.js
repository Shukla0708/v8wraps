import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlqJe53Ncam_b5V8U-mzx4jscJXONEyN4",
  authDomain: "v8wraps.firebaseapp.com",
  projectId: "v8wraps",
  storageBucket: "v8wraps.firebasestorage.app",
  messagingSenderId: "430134340268",
  appId: "1:430134340268:web:80f32ec1914e6278690d09",
  measurementId: "G-SENF9CFXSL"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
