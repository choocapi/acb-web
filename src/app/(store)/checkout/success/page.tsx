"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/lib/hook";
import { CheckCircle, Home, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
          <h1 className="text-3xl font-bold text-green-700">
            Đơn hàng đã được xác nhận!
          </h1>
          <p className="text-muted-foreground text-lg">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được đặt thành công.
            placed.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Package className="mr-2 h-5 w-5" />
              Chi tiết đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="mb-1 text-sm font-medium">Số đơn hàng</p>
              <p className="text-2xl font-bold">{orderId}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <p className="mb-1 font-medium">Thời gian giao hàng</p>
                <p className="text-muted-foreground">
                  {new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="mb-1 font-medium">Trạng thái đơn hàng</p>
                <p className="text-green-600">Đang xử lý</p>
              </div>
            </div>

            <div className="text-muted-foreground space-y-1 text-sm">
              <p>📧 Một email xác nhận đã được gửi đến địa chỉ email của bạn</p>
              <p>
                📦 Bạn sẽ nhận được thông tin theo dõi khi đơn hàng được giao
              </p>
              <p>
                💬 Nếu có vấn đề, vui lòng liên hệ với nhóm hỗ trợ bất cứ lúc
                nào
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Tiếp tục mua sắm
              </Button>
            </Link>
            <Link href="/orders" className="w-full">
              <Button className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Theo dõi đơn hàng
              </Button>
            </Link>
          </div>

          <p className="text-muted-foreground text-sm">
            Cần hỗ trợ?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Liên hệ hỗ trợ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
