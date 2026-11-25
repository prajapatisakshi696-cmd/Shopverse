import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { CATEGORIES } from "@/lib/validators";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const category = (CATEGORIES as readonly string[]).includes(product.category)
    ? (product.category as (typeof CATEGORIES)[number])
    : CATEGORIES[0];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Edit product</h1>
      <ProductForm
        productId={product.id}
        defaultValues={{
          title: product.title,
          description: product.description,
          price: product.price / 100, // paise to rupees
          image: product.image,
          category,
          stock: product.stock,
        }}
      />
    </main>
  );
}