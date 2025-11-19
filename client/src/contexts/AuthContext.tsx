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
import { auth } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string, role?: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  signinWithGoogle: () => Promise<void>;
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

  async function syncUserWithBackend(user: User, role?: string) {
    try {
      await apiRequest("POST", "/api/auth/sync", {
        firebaseUid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role || "user",
      });
    } catch (error) {
      console.error("Failed to sync user with backend:", error);
    }
  }

  async function signup(email: string, password: string, displayName: string, role: string = "user") {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    await syncUserWithBackend(user, role);
  }

  async function getUserRole(firebaseUid: string): Promise<string | null> {
    try {
      const data: any = await apiRequest("GET", `/api/auth/user/${firebaseUid}`);
      return data?.user?.role || null;
    } catch (error) {
      console.error("Failed to get user role:", error);
      return null;
    }
  }

  async function signin(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signout() {
    await signOut(auth);
  }

  async function signinWithGoogle() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    await syncUserWithBackend(user);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await syncUserWithBackend(user);
      }
      
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
