export interface User {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  district?: string;
  province_city?: string;
  avatar?: string;
  bio?: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
}

export interface AddressDelivery {
  id: string;
  userId: string;
  name: string;
  phone: string;
  city_province: string;
  address: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
