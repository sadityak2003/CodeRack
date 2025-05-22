import { 
  signInWithPopup, 
  signOut,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth, provider } from "./firebase";

// providers


export const googleLogin = async () => {
  try {
    // Set persistence first
    await setPersistence(auth, browserLocalPersistence);
    
    // Force fresh credential selection
    provider.setCustomParameters({
      prompt: "select_account"
    });

    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error("Login error:", err);
    throw err; // Re-throw to handle in UI
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Logout error:", err);
    throw err;
  }
};