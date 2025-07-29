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
import { getCategories } from "@/lib/features/category/categoryThunks";
import {
  deleteProduct,
  getProducts,
} from "@/lib/features/product/productThunks";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { formatPrice } from "@/lib/utils";
import { Edit, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.product.products);
  const categories = useAppSelector((state) => state.category.categories);
  const loading = useAppSelector((state) => state.product.loading);

  useEffect(() => {
    dispatch(getProducts({ isActive: false }));
    dispatch(getCategories());
  }, []);

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
        <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
        <Link href="/admin/add-product">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Không tìm thấy sản phẩm.
              </p>
              <Link href="/admin/add-product">
                <Button>Thêm sản phẩm đầu tiên</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-muted-foreground text-sm">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.categoryId && (
                        <Badge variant="secondary">
                          {
                            categories.find(
                              (category) => category.id === product.categoryId
                            )?.name
                          }
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            dispatch(deleteProduct({ productId: product.id! }))
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
