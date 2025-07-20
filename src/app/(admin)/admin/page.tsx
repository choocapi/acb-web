"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProduct } from "@/lib/product-context";
import { formatPrice } from "@/lib/utils";
import { Package, Plus, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { products, getProducts } = useProduct();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
    setLoading(false);
  }, []);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + product.price, 0);
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trang quản lý</h1>
        <p className="text-muted-foreground">
          Chào mừng bạn đến với trang quản lý.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-muted-foreground text-xs">Sản phẩm trong kho</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
            <p className="text-muted-foreground text-xs">
              Tổng giá trị sản phẩm
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Giá trung bình
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(avgPrice)}</div>
            <p className="text-muted-foreground text-xs">
              Giá trung bình sản phẩm
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Danh mục</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(products.map((p) => p.categoryId)).size}
            </div>
            <p className="text-muted-foreground text-xs">Danh mục sản phẩm</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/admin/add-product">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm mới
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-muted-foreground">Không có sản phẩm.</p>
            ) : (
              <div className="space-y-2">
                {products.slice(-3).map((product) => (
                  <div key={product.id} className="flex items-center space-x-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
