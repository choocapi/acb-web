"use client";

import { resetAuth, setRole, setUser } from "@/lib/features/auth/authSlice";
import { fetchUserData } from "@/lib/features/auth/authThunks";
import { loadCart, saveCart } from "@/lib/features/cart/cartSlice";
import { getOrders } from "@/lib/features/order/orderThunks";
import { auth } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { AppStore, makeStore } from "@/lib/store";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";

function AuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser.uid);
        if (userData) {
          dispatch(setUser(userData));
          dispatch(setRole(userData.role));
        } else {
          dispatch(resetAuth());
        }
      } else {
        dispatch(resetAuth());
      }
    });

    return () => unsubscribe();
  });

  return null;
}

function CartListener() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(loadCart());
  }, []);

  useEffect(() => {
    dispatch(saveCart());
  }, [items]);

  return null;
}

function OrderListener() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(getOrders({ user }));
    }
  }, [user]);

  return null;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <AuthListener />
      <CartListener />
      <OrderListener />
      {children}
    </Provider>
  );
}
