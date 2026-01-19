import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD10al9ZZJ9AryMUHGOSgyfNNkz3dufQ68",
  authDomain: "login-form-1ca44.firebaseapp.com",
  projectId: "login-form-1ca44",
  storageBucket: "login-form-1ca44.appspot.com",
  messagingSenderId: "270153017141",
  appId: "1:270153017141:web:94f55908c7ced74fa04e7c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged, signOut };
