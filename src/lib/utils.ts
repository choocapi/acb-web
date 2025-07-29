"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function genUserName(): string {
  const prefix = "user";
  const randomPostfix = Math.random().toString(36).substring(2);
  const randomUserName = `${prefix}-${randomPostfix}`;
  return randomUserName;
}

export function genTrackingNumber(): string {
  const prefix = "TRK";
  return `${prefix}-${uuidv4()}`;
}

export function checkWhiteListEmail(email: string): boolean {
  if (!process.env.NEXT_PUBLIC_WHITE_LIST_ADMIN?.includes(email)) {
    return false;
  }
  return true;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
