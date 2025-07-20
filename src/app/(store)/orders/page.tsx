"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, CheckCircle, Clock, Package, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock order data - in a real app, this would come from an API
const mockOrders = [
  {
    id: "ORD-001",
    date: "2025-01-05",
    status: "delivered",
    total: 2000000,
    items: [
      {
        id: 1,
        title: "Tai nghe Premium Wireless",
        price: 2000000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      },
    ],
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2025-01-03",
  },
  {
    id: "ORD-002",
    date: "2025-01-07",
    status: "shipped",
    total: 1000000,
    items: [
      {
        id: 2,
        title: "Ghế văn phòng Ergonomic",
        price: 1000000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
      },
    ],
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2025-01-10",
  },
  {
    id: "ORD-003",
    date: "2025-01-09",
    status: "processing",
    total: 1900000,
    items: [
      {
        id: 3,
        title: "Ốp điện thoại",
        price: 1800000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1601972602288-f64ba92cbc35?w=500&h=500&fit=crop",
      },
      {
        id: 4,
        title: "Kính cường lực",
        price: 100000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
      },
    ],
    trackingNumber: null,
    estimatedDelivery: "2025-01-15",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "processing":
      return <Clock className="h-4 w-4" />;
    case "shipped":
      return <Truck className="h-4 w-4" />;
    case "delivered":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "processing":
      return "Đang xử lý";
    case "shipped":
      return "Đang giao";
    case "delivered":
      return "Đã giao";
    default:
      return "Đang xử lý";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "processing":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "shipped":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang chủ
          </Button>
        </Link>
        <div className="mt-2">
          <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
          <p className="text-muted-foreground">
            Theo dõi trạng thái đơn hàng và xem lịch sử đơn hàng
          </p>
        </div>
      </div>

      {mockOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="text-muted-foreground mb-4 h-16 w-16" />
            <h3 className="mb-2 text-xl font-semibold">Không có đơn hàng</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Bạn chưa đặt đơn hàng nào. Bắt đầu mua sắm để xem đơn hàng của bạn
              ở đây.
            </p>
            <Link href="/">
              <Button>Bắt đầu mua sắm</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {mockOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Đơn hàng {order.id}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Đặt vào {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">
                        {getStatusText(order.status)}
                      </span>
                    </Badge>
                    <p className="mt-2 text-lg font-semibold">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="rounded-md object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-muted-foreground text-sm">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Thời gian giao hàng
                      </p>
                      <p>
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                    {order.trackingNumber && (
                      <div>
                        <p className="text-muted-foreground font-medium">
                          Số đơn hàng
                        </p>
                        <p className="font-mono">{order.trackingNumber}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Trạng thái
                      </p>
                      <p className="capitalize">
                        {getStatusText(order.status)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  {order.trackingNumber && (
                    <Button variant="outline" size="sm">
                      Theo dõi đơn hàng
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Xem chi tiết
                  </Button>
                  {order.status === "delivered" && (
                    <Button variant="outline" size="sm">
                      Viết đánh giá
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Đặt lại đơn hàng
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Additional Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Cần hỗ trợ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium">Câu hỏi đơn hàng</h4>
              <p className="text-muted-foreground mb-2">
                Có câu hỏi về đơn hàng của bạn? Chúng tôi sẽ giúp bạn.
              </p>
              <Button variant="outline" size="sm">
                Liên hệ hỗ trợ
              </Button>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Đổi trả</h4>
              <p className="text-muted-foreground mb-2">
                Chính sách đổi trả 30 ngày. Miễn phí đổi trả trên 250.000đ.
              </p>
              <Button variant="outline" size="sm">
                Bắt đầu đổi trả
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
