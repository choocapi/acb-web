"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getStatusColor,
  getStatusText,
  getStatusIcon,
} from "@/constants/status";
import { getOrders, updateOrderStatus } from "@/lib/features/order/orderThunks";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { formatPrice } from "@/lib/utils";
import { CheckCircle, Truck } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.order.orders);
  const loading = useAppSelector((state) => state.order.loading);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(getOrders({ user }));
    }
  }, [user]);

  async function handleUpdateOrderStatus(
    orderId: string,
    status: "processing" | "shipped" | "delivered"
  ) {
    try {
      const result = await dispatch(
        updateOrderStatus({ orderId, status })
      ).unwrap();
      if (result.success) {
        toast.success(result.message);
        dispatch(getOrders({ user: user! }));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Đang tải sản phẩm...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Đơn hàng</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Không tìm thấy đơn hàng.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={order.items[0].image}
                          alt={order.items[0].title}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                        <div>
                          <div className="font-medium">
                            {order.items[0].title}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            ID: {order.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.items.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">
                          {getStatusText(order.status)}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.status === "processing" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateOrderStatus(order.id!, "shipped")
                          }
                          className="flex items-center gap-2"
                        >
                          <Truck className="h-4 w-4" />
                          Giao hàng
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateOrderStatus(order.id!, "delivered")
                          }
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Hoàn thành
                        </Button>
                      )}
                      {order.status === "delivered" && (
                        <span className="text-muted-foreground text-sm">
                          Đã hoàn thành
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
