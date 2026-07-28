export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type PropertyStatus = "AVAILABLE" | "UNAVAILABLE" | "RENTED";
export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
}

export interface Landlord {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number | null;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
  landlordId: string;
  categoryId: string;
  category?: Category;
  landlord?: Landlord;
  reviews?: Review[];
  _count?: { rentalRequests: number; reviews: number };
}

export interface RentalRequest {
  id: string;
  status: RentalStatus;
  moveInDate: string;
  message?: string | null;
  createdAt: string;
  tenantId: string;
  propertyId: string;
  property: Property;
  tenant?: { id: string; name: string; email: string; phone?: string | null };
  payment?: Payment | null;
}

export interface Payment {
  id: string;
  transactionId: string;
  amount: string;
  method: string;
  provider: "STRIPE" | "SSLCOMMERZ";
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
  rentalRequestId: string;
  rentalRequest?: RentalRequest;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  tenant?: { id: string; name: string };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
