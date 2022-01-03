import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, onSnapshot, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxughVrjr7yAfiVJeZCmxhUEaSTJ--IW0",
  authDomain: "spotifyrecommender-f5029.firebaseapp.com",
  projectId: "spotifyrecommender-f5029",
  storageBucket: "spotifyrecommender-f5029.appspot.com",
  messagingSenderId: "289994471786",
  appId: "1:289994471786:web:0b340149a0bd0b20684d13",
  measurementId: "G-5GP9MZ5MFT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const subscribeToUser = (userId, onChange) => {
  onSnapshot(doc(db, "Users", userId), (doc) => {
    onChange(doc.data());
  });
};

const docRef = doc(db, "Users", "12175261097");
getDoc(docRef).then((docSnap) => console.log(docSnap.data()));

export default { subscribeToUser };
