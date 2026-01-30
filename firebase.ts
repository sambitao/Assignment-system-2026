
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBZVvsZcsdrCDYb5JqiZFLaN52hjUi_Arw",
  authDomain: "assignment-interruption-e9481.firebaseapp.com",
  projectId: "assignment-interruption-e9481",
  storageBucket: "assignment-interruption-e9481.firebasestorage.app",
  messagingSenderId: "246855027730",
  appId: "1:246855027730:web:a61bd1dcb9e103c3cc9ccb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// เพิ่ม Microsoft Provider
export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: 'select_account',
  // สามารถระบุ tenant id ของบริษัทได้ถ้าต้องการบังคับเฉพาะองค์กร
  // tenant: 'organizations' 
});
