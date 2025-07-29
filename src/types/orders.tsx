import { CartItem } from "./product";

export interface Order {
  id?: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery: Date;
  trackingNumber: string;
  items: CartItem[];
  addressDelivery: AddressDelivery;
}

export interface AddressDelivery {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  province_city: string;
}
