"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, productSchema, type ProductInput } from "@/lib/validators";

export default function ProductForm({
  productId,
  defaultValues,
}: {
  productId?: string;
  defaultValues?: ProductInput;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? { category: "Electronics", stock: 0 },
  });

  const onSubmit = async (values: ProductInput) => {
    setError("");
    const res = await fetch(
      productId ? `/api/admin/products/${productId}` : "/api/admin/products",
      {
        method: productId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  const err = (name: keyof ProductInput) =>
    errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]?.message}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input {...register("title")} className="input" />
        {err("title")}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea {...register("description")} rows={4} className="input" />
        {err("description")}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Price (₹)</label>
          <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className="input" />
          {err("price")}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Stock</label>
          <input type="number" {...register("stock", { valueAsNumber: true })} className="input" />
          {err("stock")}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select {...register("category")} className="input">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {err("category")}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Image URL</label>
        <input {...register("image")} placeholder="https://..." className="input" />
        {err("image")}
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Saving..." : productId ? "Save changes" : "Add product"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}