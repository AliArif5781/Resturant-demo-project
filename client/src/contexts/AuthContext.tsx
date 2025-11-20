import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string, role?: string) => Promise<string>;
  signin: (email: string, password: string) => Promise<string>;
  signout: () => Promise<void>;
  signinWithGoogle: () => Promise<string>;
  getUserRole: (firebaseUid: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function syncUserWithBackend(user: User, role?: string): Promise<string> {
    try {
      const payload: any = {
        firebaseUid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      
      if (role !== undefined) {
        payload.role = role;
      }
      
      const response: any = await apiRequest("POST", "/api/auth/sync", payload);
      return response?.user?.role || "user";
    } catch (error) {
      console.error("Failed to sync user with backend:", error);
      return "user";
    }
  }

  async function signup(email: string, password: string, displayName: string, role: string = "user"): Promise<string> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    try {
      await updateProfile(user, { displayName });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: "user",
        createdAt: serverTimestamp(),
        photoURL: user.photoURL || null,
      });

      await syncUserWithBackend(user, "user");
      
      const userRole = await getUserRole(user.uid);
      return userRole || "user";
    } catch (error) {
      console.error("Failed to create user profile:", error);
      await user.delete();
      throw new Error("Failed to create user profile. Please try again.");
    }
  }

  async function getUserRole(firebaseUid: string): Promise<string | null> {
    try {
      const userDocRef = doc(db, "users", firebaseUid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data()?.role || "user";
      }
      return "user";
    } catch (error) {
      console.error("Failed to get user role from Firestore:", error);
      return "user";
    }
  }

  async function signin(email: string, password: string): Promise<string> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Signin - Firebase UID:", user.uid);
    
    // Sync user with backend to ensure they exist in the database
    await syncUserWithBackend(user);
    
    const role = await getUserRole(user.uid);
    console.log("Signin - Retrieved role:", role);
    return role || "user";
  }

  async function signout() {
    await signOut(auth);
  }

  async function signinWithGoogle(): Promise<string> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: "user",
          createdAt: serverTimestamp(),
          photoURL: user.photoURL || null,
        });
      }

      await syncUserWithBackend(user);
      const role = await getUserRole(user.uid);
      return role || "user";
    } catch (error) {
      console.error("Failed to setup user profile:", error);
      throw new Error("Failed to setup user profile. Please try signing in again.");
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    signin,
    signout,
    signinWithGoogle,
    getUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
