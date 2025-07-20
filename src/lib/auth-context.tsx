"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, firestore } from "./firebase";
import { User } from "@/types/user";
import { checkWhiteListEmail, genUserName } from "./utils";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Response } from "@/types/response";

interface AuthContextType {
  isAdmin: boolean;
  isUser: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<Response>;
  loginWithGoogle: () => Promise<Response>;
  register: (
    fullName: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<Response>;
  logout: () => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        updateUserData(firebaseUser.uid);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsUser(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: User = {
          uid: data?.uid,
          email: data?.email || null,
          fullName: data?.fullName || null,
          phone: data?.phone || null,
          avatar: data?.avatar || null,
          role: data?.role || null,
          isActive: data?.isActive || null,
          isDeleted: data?.isDeleted || null,
        };
        setUser(userData);
        setIsAdmin(userData.role === "admin");
        setIsUser(userData.role === "user");
      }
    } catch (error) {
      console.error("Failed to update user data", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("result", result);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      return { success: true, message: "Đăng nhập thành công" };
    } catch (error) {
      console.error("Failed to login", error);
      return { success: false, message: "Đăng nhập thất bại" };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      return { success: true, message: "Đăng nhập thành công" };
    } catch (error) {
      console.error("Failed to login with Google", error);
      return { success: false, message: "Đăng nhập thất bại" };
    }
  };

  const register = async (
    fullName: string,
    email: string,
    phone: string,
    password: string
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(firestore, "users", res?.user?.uid), {
        uid: res?.user?.uid,
        email: email,
        phone: phone,
        fullName: fullName || genUserName(),
        role: checkWhiteListEmail(email) ? "admin" : "user",
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { success: true, message: "Đăng ký thành công" };
    } catch (error) {
      console.error("Failed to register", error);
      return { success: false, message: "Đăng ký thất bại" };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      return { success: true, message: "Đăng xuất thành công" };
    } catch (error) {
      console.error("Failed to logout", error);
      return { success: false, message: "Đăng xuất thất bại" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isUser,
        user,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
