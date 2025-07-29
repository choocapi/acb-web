import { auth, firestore } from "@/lib/firebase";
import { RootState } from "@/lib/store";
import { checkWhiteListEmail, genUserName } from "@/lib/utils";
import { Response } from "@/types/response";
import { User } from "@/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Helper function to fetch user data from firestore
export const fetchUserData = async (uid: string): Promise<User | null> => {
  const docRef = doc(firestore, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      uid: data.uid,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      avatar: data?.avatar || null,
      role: data.role,
      bio: data.bio,
      address: data.address,
      district: data.district,
      province_city: data.province_city,
      createdAt: data.createdAt?.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString(),
      isActive: data.isActive,
      isDeleted: data.isDeleted,
    };
  }
  return null;
};

// Thunk for login
export const login = createAsyncThunk<
  Response,
  { email: string; password: string },
  { rejectValue: Response }
>("auth/login", async ({ email, password }, thunkAPI) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userData = await fetchUserData(result.user.uid);
    if (!userData) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }
    const token = await result.user.getIdToken();
    localStorage.setItem("token_firebase", token);
    return {
      success: true,
      message: "Đăng nhập thành công",
      data: userData,
    };
  } catch (error: any) {
    let message = "Đăng nhập thất bại";
    if (error.code === "auth/wrong-password") message = "Mật khẩu không đúng.";
    else if (error.code === "auth/user-not-found")
      message = "Người dùng không tồn tại.";
    return thunkAPI.rejectWithValue({
      success: false,
      message,
    });
  }
});

// Thunk for login with Google
export const loginWithGoogle = createAsyncThunk<
  Response,
  void,
  { rejectValue: Response }
>("auth/loginWithGoogle", async (_, thunkAPI) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Check if user exists in firestore
    const userDataInDb = await fetchUserData(result.user.uid);
    if (!userDataInDb) {
      const newUser: User = {
        uid: result.user.uid,
        email: result.user.email!,
        fullName: result.user.displayName || genUserName(),
        phone: result.user.phoneNumber || "",
        avatar: result.user.photoURL || "",
        bio: "",
        address: "",
        district: "",
        province_city: "",
        role: checkWhiteListEmail(result.user.email!) ? "admin" : "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isDeleted: false,
      };
      await setDoc(doc(firestore, "users", result.user.uid), newUser);
    }

    const userData = await fetchUserData(result.user.uid);
    if (!userData) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    const token = await result.user.getIdToken();
    localStorage.setItem("token_firebase", token);

    return {
      success: true,
      message: "Đăng nhập thành công",
      data: userData,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Đăng nhập thất bại",
    });
  }
});

// Thunk for sign up
export const signUp = createAsyncThunk<
  Response,
  { fullName: string; email: string; phone: string; password: string },
  { rejectValue: Response }
>("auth/signUp", async ({ fullName, email, phone, password }, thunkAPI) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (!result.user) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Tạo tài khoản thất bại",
      });
    }

    const newUser: User = {
      uid: result.user.uid,
      email,
      fullName,
      phone,
      role: checkWhiteListEmail(email) ? "admin" : "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      isDeleted: false,
    };
    await setDoc(doc(firestore, "users", result.user.uid), newUser);

    const serializedUser = {
      ...newUser,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };

    return {
      success: true,
      message: "Đăng ký thành công",
      data: serializedUser,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Đăng ký thất bại",
    });
  }
});

// Thunk for logout
export const logout = createAsyncThunk<
  Response,
  void,
  { rejectValue: Response }
>("auth/logout", async (_, thunkAPI) => {
  try {
    await signOut(auth);
    localStorage.removeItem("token_firebase");

    return {
      success: true,
      message: "Đăng xuất thành công",
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Đăng xuất thất bại",
    });
  }
});

export const updateUser = createAsyncThunk<
  Response,
  { user: Partial<User> },
  { rejectValue: Response }
>("auth/updateUser", async ({ user }, thunkAPI) => {
  try {
    if (!user.uid) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Bắt buộc phải có id người dùng",
      });
    }

    const docRef = doc(firestore, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    const updatedUser = { ...user, updatedAt: new Date() };
    await updateDoc(docRef, updatedUser);

    return {
      success: true,
      message: "Cập nhật người dùng thành công",
      data: {
        ...updatedUser,
        createdAt: updatedUser.createdAt?.toISOString(),
        updatedAt: updatedUser.updatedAt?.toISOString(),
      },
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Cập nhật người dùng thất bại",
    });
  }
});

// export const listenToAuthChanges = createAsyncThunk<void, void>(
//   "auth/listenToAuthChanges",
//   async (_, thunkAPI) => {
//     return new Promise<void>((resolve) => {
//       onAuthStateChanged(auth, async (firebaseUser) => {
//         if (firebaseUser) {
//           const userData = await fetchUserData(firebaseUser.uid);
//           if (userData) {
//             thunkAPI.dispatch(setUser(userData));
//             thunkAPI.dispatch(setRole(userData.role));
//           } else {
//             thunkAPI.dispatch(clearUser());
//           }
//         }
//         resolve();
//       });
//     });
//   }
// );
