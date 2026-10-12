"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface CustomerState {
  token: string | null;
  customer: Customer | null;
  setSession: (token: string, customer: Customer) => void;
  setCustomer: (customer: Customer) => void;
  clearSession: () => void;
}

/** Signed-in customer. Persisted so the login survives reloads. */
export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      token: null,
      customer: null,
      setSession: (token, customer) => set({ token, customer }),
      setCustomer: (customer) => set({ customer }),
      clearSession: () => set({ token: null, customer: null }),
    }),
    { name: "oven-customer" },
  ),
);
