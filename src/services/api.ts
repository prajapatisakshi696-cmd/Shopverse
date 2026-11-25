import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { OrderInput } from "@/lib/validators";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
}

interface ProductsParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Product", "Order"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsParams>({
      query: (params) => ({ url: "products", params }),
      providesTags: ["Product"],
    }),
    getProduct: builder.query<Product, string>({
      query: (slug) => `products/${slug}`,
      providesTags: ["Product"],
    }),
    createOrder: builder.mutation<{ id: string }, OrderInput>({
      query: (body) => ({ url: "orders", method: "POST", body }),
      invalidatesTags: ["Product", "Order"], // stock changed, refetch products
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery, useCreateOrderMutation } = api;