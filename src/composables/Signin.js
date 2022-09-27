import { socket } from "@/plugins/socket";

import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { ref } from "vue";
import { auth } from "@config/firebase";

import router from "@router/index";
import { addDoc, collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";

const isPending = ref(false);
const errorMessage = ref("");

const afterLoginSuccess = async (userData) => {
  const usersRef = collection(db, "users");
  const { displayName, photoURL, email, phoneNumber, uid } = userData;
  const currentUser = { uid, displayName, photoURL, email, phoneNumber };
  const q = query(usersRef, where("uid", "==", uid), limit(1));
  const userExists = await getDocs(q);
  if (userExists.empty) {
    await addDoc(usersRef, currentUser);    
  }
  localStorage.setItem("auth", JSON.stringify(currentUser));
  socket.connect();
  socket.auth = currentUser;
  router.push({ name: "chat", params: { id: "public-messages" } });
};

const setLoginStatus = () => {
  isPending.value = true;
  errorMessage.value = "";
};

const signin = async ({ email, password }) => {
  try {
    setLoginStatus();
    const res = await signInWithEmailAndPassword(auth, email, password);
    await afterLoginSuccess(res.user);
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage.value = "Invalid email";
        break;
      case "auth/internal-error":
        errorMessage.value = "Missing password";
        break;
      case "auth/wrong-password":
        errorMessage.value = "Wrong password";
        break;
      case "auth/user-not-found":
        errorMessage.value = "Email not found";
        break;
      default:
        errorMessage.value = error.code;
    }
  } finally {
    isPending.value = false;
  }
};

const googleProvider = new GoogleAuthProvider();
const signinWithGoogle = async () => {
  try {
    setLoginStatus();
    const res = await signInWithPopup(auth, googleProvider);
    await afterLoginSuccess(res.user);
  } catch (error) {
    errorMessage.value = error.code;
  } finally {
    isPending.value = false;
  }
};

const faceBookProvider = new FacebookAuthProvider();
const signinWithFacebook = async () => {
  try {
    setLoginStatus();
    const res = await signInWithPopup(auth, faceBookProvider);
    await afterLoginSuccess(res.user);
  } catch (error) {
    errorMessage.value = error.code;
  } finally {
    isPending.value = false;
  }
};

export {
  signin,
  signinWithGoogle,
  signinWithFacebook,
  isPending,
  errorMessage,
};
