import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAU4tUuF1foPKtrWhNZxzQCQYGiS4eL-ks",
  authDomain: "blooddata-dbb32.firebaseapp.com",
  projectId: "blooddata-dbb32",
  storageBucket: "blooddata-dbb32.appspot.com",
  messagingSenderId: "350040145502",
  appId: "1:350040145502:web:b632973d62b917ca1abecf",
};

// init firebase
initializeApp(firebaseConfig)

// init firestore service
const db = getFirestore()
export default db
