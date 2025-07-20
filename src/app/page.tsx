"use client";

import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import { useProduct } from "@/lib/product-context";
import { useEffect } from "react";

export default function Home() {
  const { products, getProducts } = useProduct();

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main>
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
                Chào mừng đến với{" "}
                <span className="text-primary">ACB Computer</span>
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                Khám phá sản phẩm tuyệt vời với giá cả hấp dẫn. Mua sắm tất cả
                những gì bạn cần.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="mb-6 text-3xl font-bold">Sản phẩm nổi bật</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {products.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  Không có sản phẩm nào có sẵn tại thời điểm này.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
