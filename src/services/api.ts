import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
}

interface ProductsParams {
  search?: string;
  category?: string;
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
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = api;
