import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";

export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error("Login error:", err);
  }
};

export const logout = async () => {
  await signOut(auth);
};
