import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCoGh-xqzhvg0B8Y9xYHpESCBmkGML2lfA",
    authDomain: "learnasl-org.firebaseapp.com",
    databaseURL: "https://learnasl-org-default-rtdb.firebaseio.com",
    projectId: "learnasl-org",
    storageBucket: "learnasl-org.firebasestorage.app",
    messagingSenderId: "560516423072",
    appId: "1:560516423072:web:c8c268082c5dd21e0918c5",
    measurementId: "G-CX83M9KBTE"
  };


const app = initializeApp(firebaseConfig);


// Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
