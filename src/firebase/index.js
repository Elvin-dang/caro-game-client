import firebase from 'firebase/app';
import 'firebase/storage'

const firebaseConfig = {
	apiKey: "AIzaSyAkgUhH621obTe-dneeKAU4TWcCqh8Bo60",
    authDomain: "game-caro-avatar.firebaseapp.com",
    projectId: "game-caro-avatar",
    storageBucket: "game-caro-avatar.appspot.com",
    messagingSenderId: "650611804193",
    appId: "1:650611804193:web:e55b985705982259a87b60"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };