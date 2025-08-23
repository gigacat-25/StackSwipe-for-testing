
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  projectId: 'stackswipe',
  appId: '1:852716346687:web:88d2893886c144b930c78a',
  storageBucket: 'stackswipe.firebasestorage.app',
  apiKey: 'AIzaSyBVXvlNNOWxmSKGc-mboOoDAnPkVmjupZs',
  authDomain: 'stackswipe.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '852716346687',
};

// Initialize Firebase
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
