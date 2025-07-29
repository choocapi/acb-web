"use client";

import Rating from "@/components/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import { ArrowLeft, Minus, Plus, ShoppingCart, StarIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const mockFeedbacks = [
  {
    id: "1",
    productId: "UPB5fcmm24pKqt6KqhUt",
    fullName: "Choocapi",
    rating: 5,
    content: "Sản phẩm rất tốt, đúng với mô tả, chất lượng tốt",
    createdAt: new Date("2025-07-29T00:00:00.000Z"),
    updatedAt: new Date("2025-07-29T00:00:00.000Z"),
  },
  {
    id: "2",
    productId: "UPB5fcmm24pKqt6KqhUt",
    fullName: "Chau Minh Duong",
    rating: 4,
    content: "Cũng tạm tạm",
    createdAt: new Date("2025-07-26T00:00:00.000Z"),
    updatedAt: new Date("2025-07-26T00:00:00.000Z"),
  },
  {
    id: "3",
    productId: "mOQVuH5Y8aXzdjh7vptl",
    fullName: "Nguyen Van A",
    rating: 4,
    content: "Tạm tạm",
    createdAt: new Date("2025-07-25T00:00:00.000Z"),
    updatedAt: new Date("2025-07-26T00:00:00.000Z"),
  },
];

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.categories);
  const products = useAppSelector((state) => state.product.products);
  const feedbacks = mockFeedbacks.filter(
    (feedback) => feedback.productId === params.id
  );

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      setProduct(products.find((product) => product.id === params.id) || null);
      setLoading(false);
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      toast.success(
        `${quantity} × ${product.title} đã được thêm vào giỏ hàng!`
      );
      // Show some feedback that item was added
      router.push("/cart");
    }
  };

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Đang tải sản phẩm...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Sản phẩm không tồn tại</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            {product.categoryId && (
              <Badge variant="secondary" className="mb-2">
                {
                  categories.find(
                    (category) => category.id === product.categoryId
                  )?.name
                }
              </Badge>
            )}
            <h1 className="mb-4 text-3xl font-bold">{product.title}</h1>
            <p className="text-primary mb-4 text-4xl font-bold">
              {formatPrice(product.price)}
            </p>
          </div>

          {product.description && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Mô tả</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Số lượng
                  </label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-8 text-center text-lg font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Thêm vào giỏ hàng - {formatPrice(product.price * quantity)}
                  </Button>

                  <div className="text-muted-foreground space-y-1 text-sm">
                    <p>✓ Miễn phí vận chuyển trên 250.000đ</p>
                    <p>✓ Chính sách đổi trả 30 ngày</p>
                    <p>✓ Bảo hành 1 năm</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          <div className="gap-8 border-t pt-8">
            <h2 className="mb-4 text-2xl font-bold">Đánh giá sản phẩm</h2>
            <div className="space-y-4 rounded-lg border p-4">
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {feedback.fullName}
                        </h3>
                        <Rating rating={feedback.rating} />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {feedback.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-muted-foreground">
                        {feedback.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Chưa có đánh giá nào</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
