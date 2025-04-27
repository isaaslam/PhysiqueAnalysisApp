// src/firebase/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAdpkuXXM53KhXltwouKUDdnlcEnqG9VYY",
  authDomain: "physiqueanalysisapp.firebaseapp.com",
  projectId: "physiqueanalysisapp",
  storageBucket: "physiqueanalysisapp.firebasestorage.app",
  messagingSenderId: "129229592388",
  appId: "1:129229592388:web:9613ba67fb737b9e382911",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
