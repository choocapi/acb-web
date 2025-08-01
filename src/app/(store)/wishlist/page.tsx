"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/lib/hook";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

// Mock wishlist data
const mockWishlistItems = [
  {
    id: "UPB5fcmm24pKqt6KqhUt",
    title: "Laptop gaming ASUS ROG Strix SCAR 16 G635LX RW192W",
    price: 105000000,
    originalPrice: 118000000,
    image:
      "https://firebasestorage.googleapis.com/v0/b/ecommerce-store-6d7b7.firebasestorage.app/o/products%2Fscar_new_16_l.png?alt=media&token=34fafd1c-d755-4785-b939-bd2016e64fa9",
    inStock: true,
    category: "Laptop",
    addedDate: "2025-07-28",
  },
  {
    id: "mOQVuH5Y8aXzdjh7vptl",
    title:
      'Màn hình Asus TUF GAMING VG259Q3A 25" Fast IPS 180Hz Gsync chuyên game',
    price: 2990000,
    originalPrice: 3090000,
    image:
      "https://firebasestorage.googleapis.com/v0/b/ecommerce-store-6d7b7.firebasestorage.app/o/products%2Fasus_vg259q3a.jpg?alt=media&token=cc2815a9-d84d-48c1-9a21-95fa5d558645",
    inStock: true,
    category: "Màn hình",
    addedDate: "2025-07-28",
  },
  {
    id: "nk3zBSBAuqIj2yojvpi9",
    title: "Camera WIFI UNV IPC-S3E-M3 (3MP - Quay quét - Đàm thoại 2 chiều)",
    price: 165000,
    originalPrice: 190000,
    image:
      "https://firebasestorage.googleapis.com/v0/b/ecommerce-store-6d7b7.firebasestorage.app/o/products%2Funv_ipc_s3e_m3.png?alt=media&token=8810b8fa-864a-4053-90b1-ca30effafc12",
    inStock: false,
    category: "Camera",
    addedDate: "2025-07-28",
  },
];

export default function WishlistPage() {
  const handleRemoveFromWishlist = (id: string, title: string) => {
    toast.success(`${title} đã được xóa khỏi danh sách yêu thích`);
  };

  const handleAddToCart = (item: (typeof mockWishlistItems)[0]) => {
    if (!item.inStock) {
      toast.error("Sản phẩm hiện tại đã hết hàng");
      return;
    }
    toast.success(`${item.title} đã được thêm vào giỏ hàng!`);
  };

  const handleMoveAllToCart = () => {
    const inStockItems = mockWishlistItems.filter((item) => item.inStock);
    if (inStockItems.length === 0) {
      toast.error("Không có sản phẩm nào trong giỏ hàng");
      return;
    }
    toast.success(`${inStockItems.length} sản phẩm đã được thêm vào giỏ hàng!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex-1">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang chủ
            </Button>
          </Link>
          <h1 className="mt-2 text-3xl font-bold">Danh sách yêu thích</h1>
          <p className="text-muted-foreground">
            {mockWishlistItems.length} sản phẩm đã được lưu
          </p>
        </div>
        {mockWishlistItems.length > 0 && (
          <Button onClick={handleMoveAllToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Thêm tất cả vào giỏ hàng
          </Button>
        )}
      </div>

      {mockWishlistItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="text-muted-foreground mb-4 h-16 w-16" />
            <h3 className="mb-2 text-xl font-semibold">
              Danh sách yêu thích của bạn đang trống
            </h3>
            <p className="text-muted-foreground mb-6 text-center">
              Lưu các sản phẩm bạn yêu thích vào danh sách yêu thích của bạn.
              Chúng sẽ xuất hiện ở đây để bạn có thể dễ dàng tìm kiếm sau này.
            </p>
            <Link href="/">
              <Button>Bắt đầu mua sắm</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockWishlistItems.map((item) => (
            <div
              key={item.id}
              className="relative block aspect-square h-full w-full"
            >
              <Link href={`/products/${item.id}`}>
                <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    unoptimized
                  />

                  {/* Bottom overlay with product info */}
                  <div className="absolute bottom-0 left-0 flex w-full px-4 pb-4">
                    <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
                      <h3 className="mr-4 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <p className="flex-none rounded-full bg-black p-2 text-white dark:bg-white dark:text-black">
                          {formatPrice(item.price)}
                        </p>
                        {item.originalPrice > item.price && (
                          <span className="text-muted-foreground text-xs line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock status overlay */}
                  {!item.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                        Hết hàng
                      </span>
                    </div>
                  )}

                  {/* Remove from wishlist button - top left */}
                  <div className="absolute top-2 left-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFromWishlist(item.id, item.title);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  {/* Add to cart button - top right */}
                  <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button
                      size={"icon"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(item);
                      }}
                      disabled={!item.inStock}
                      className="rounded-full bg-black text-white shadow-lg hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                      <ShoppingCart />
                    </Button>
                  </div>

                  {/* Added date badge - top center */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 transform">
                    <span className="rounded-full bg-white/70 px-2 py-1 text-xs text-black backdrop-blur-md dark:bg-black/70 dark:text-white">
                      Được thêm vào{" "}
                      {new Date(item.addedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {mockWishlistItems.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Bạn có thể cũng thích</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Dựa trên danh sách yêu thích của bạn, chúng tôi nghĩ bạn sẽ
                thích các sản phẩm này
              </p>
              <Link href="/">
                <Button variant="outline">Xem gợi ý</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
