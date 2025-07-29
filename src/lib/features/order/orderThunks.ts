import { firestore } from "@/lib/firebase";
import { Order } from "@/types/orders";
import { Response } from "@/types/response";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { clearCart } from "../cart/cartSlice";
import { User } from "@/types/user";

export const addOrder = createAsyncThunk<
  Response,
  { order: Order },
  { rejectValue: Response }
>("order/addOrder", async ({ order }, thunkAPI) => {
  try {
    const docRef = doc(collection(firestore, "orders"));
    const newOrder = { ...order, id: docRef.id };
    await setDoc(docRef, newOrder);
    thunkAPI.dispatch(clearCart());

    return {
      success: true,
      message: "Tạo đơn hàng thành công",
      data: {
        ...newOrder,
        createdAt: newOrder.createdAt.toISOString(),
        updatedAt: newOrder.updatedAt.toISOString(),
        estimatedDelivery: newOrder.estimatedDelivery.toISOString(),
      },
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Tạo đơn hàng thất bại",
    });
  }
});

export const getOrders = createAsyncThunk<
  Response,
  { user: User },
  { rejectValue: Response }
>("order/getOrders", async ({ user }, thunkAPI) => {
  try {
    let querySnapshot;
    if (user.role === "admin") {
      querySnapshot = await getDocs(collection(firestore, "orders"));
    } else {
      querySnapshot = await getDocs(
        query(collection(firestore, "orders"), where("userId", "==", user.uid))
      );
    }
    const orders: Order[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
        estimatedDelivery: data.estimatedDelivery.toDate().toISOString(),
      } as Order;
    });

    return {
      success: true,
      message: "Lấy danh sách đơn hàng thành công",
      data: orders,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Lấy danh sách đơn hàng thất bại",
    });
  }
});

export const updateOrderStatus = createAsyncThunk<
  Response,
  {
    orderId: string;
    status: "processing" | "shipped" | "delivered" | "cancelled";
  },
  { rejectValue: Response }
>("order/updateOrderStatus", async ({ orderId, status }, thunkAPI) => {
  try {
    if (!orderId) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Bắt buộc phải có id đơn hàng",
      });
    }

    const docRef = doc(firestore, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Đơn hàng không tồn tại",
      });
    }

    const orderData = docSnap.data();
    await updateDoc(docRef, {
      status,
      updatedAt: new Date(),
    });

    const updatedOrder = {
      ...orderData,
      status,
      updatedAt: new Date(),
    };

    return {
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: {
        ...updatedOrder,
        createdAt: orderData.createdAt.toDate().toISOString(),
        updatedAt: updatedOrder.updatedAt.toISOString(),
        estimatedDelivery: orderData.estimatedDelivery.toDate().toISOString(),
      },
    };
  } catch (error: any) {
    console.error("Update order status error:", error);
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Cập nhật trạng thái đơn hàng thất bại",
    });
  }
});
