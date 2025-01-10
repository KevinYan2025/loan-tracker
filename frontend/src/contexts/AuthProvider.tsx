import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../configs/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from 'firebase/auth';
import { createUser } from '../utils/api';

interface AuthContextType {
  user: any;
  handleEmailLogin: (email: string, password: string) => Promise<void>;
  handleEmailSignup: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEmailLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (user.emailVerified === false) {
        await sendEmailVerification(user);
        throw new Error("Please verify your email before logging in");
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const {user} = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(user);
      setError("Verification email sent. Please check your inbox.");
      if (user && user.email) {
        await createUser(user.uid, user.email);
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message);
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const {user}=await signInWithPopup(auth, provider);
      if (user && user.email && user.metadata.creationTime === user.metadata.lastSignInTime) {
        await createUser(user.uid, user.email);
      }

    } catch (error: any) {
      setError(error.message);
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, handleEmailLogin, handleEmailSignup, handleLogout, handleGoogleLogin, loading,setLoading, error,setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};