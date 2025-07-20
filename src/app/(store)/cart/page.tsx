"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();

  const handleRemoveItem = (id: string, title: string) => {
    removeFromCart(id);
    toast.success(`${title} đã được xóa khỏi giỏ hàng`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Giỏ hàng đã được xóa");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 text-center">
          <ShoppingBag className="text-muted-foreground mx-auto h-24 w-24" />
          <div>
            <h1 className="mb-2 text-3xl font-bold">Giỏ hàng của bạn trống</h1>
            <p className="text-muted-foreground mb-6">
              Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng của mình.
            </p>
            <Link href="/">
              <Button size="lg">Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Giỏ hàng</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 md:p-6">
                {/* Mobile Layout */}
                <div className="block space-y-4 md:hidden">
                  <div className="flex items-start space-x-3">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="rounded-md object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="hover:text-primary line-clamp-2 cursor-pointer text-base font-semibold">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id!, item.title)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quantity and Total Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id!, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="min-w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id!, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden items-center space-x-4 md:flex">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="rounded-md object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="hover:text-primary cursor-pointer text-lg font-semibold">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id!, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="min-w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id!, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="min-w-20 text-right text-lg font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id!, item.title)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Tiếp tục mua sắm
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleClearCart}
              className="w-full text-red-500 hover:text-red-700 sm:w-auto"
            >
              Xóa giỏ hàng
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tổng tiền</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>
                    Tạm tính (
                    {items.reduce((sum, item) => sum + item.quantity, 0)} sản
                    phẩm)
                  </span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>
                    {totalPrice >= 100 ? "Miễn phí" : formatPrice(9.99)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế</span>
                  <span>{formatPrice(totalPrice * 0.08)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng tiền</span>
                  <span>
                    {formatPrice(
                      totalPrice +
                        (totalPrice >= 100 ? 0 : 9.99) +
                        totalPrice * 0.08
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    Tiếp tục thanh toán
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="text-muted-foreground mt-4 space-y-1 text-sm">
                  <p>✓ Thanh toán an toàn</p>
                  <p>✓ Miễn phí vận chuyển trên 250.000đ</p>
                  <p>✓ Chính sách đổi trả 30 ngày</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
