"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SheetDemo } from "@/components/sheet";
import { Label } from "@/components/ui/label";
import { useProduct } from "@/lib/product-context";
import { uploadImage } from "@/services/imageService";
import { Product, ProductBrand, ProductCategory } from "@/types/product";
import { ComboBox } from "@/components/combo-box";
import { toast } from "sonner";

const productSchema = z.object({
  title: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  price: z.number().min(1, "Giá sản phẩm là bắt buộc"),
  stock: z.number().min(1, "Số lượng sản phẩm là bắt buộc"),
  image: z.string(),
  description: z.string(),
  categoryId: z.string(),
  brandId: z.string(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const {
    addProduct,
    categories,
    getCategories,
    brands,
    getBrands,
    addCategory,
    addBrand,
  } = useProduct();

  useEffect(() => {
    getCategories();
    getBrands();
  }, []);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: 0,
      stock: 0,
      image: "",
      description: "",
      categoryId: "",
      brandId: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
      setImageFile(null);
    }
  };

  const onAddProduct = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const imageUrl = await uploadImage(imageFile!, "products");
      const product: Product = {
        ...data,
        image: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };
      const response = await addProduct(product);

      if (response.success) {
        router.push("/admin/products");
      } else {
        toast.error("Thêm sản phẩm thất bại");
      }
    } catch (error) {
      toast.error("Lỗi thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const onAddCategory = async () => {
    const data: ProductCategory = {
      name: categoryName,
      description: categoryDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const response = await addCategory(data);
    if (response.success) {
      getCategories();
      toast.success("Thêm danh mục thành công");
    } else {
      toast.error("Thêm danh mục thất bại");
    }
  };

  const onAddBrand = async () => {
    const data: ProductBrand = {
      name: brandName,
      description: brandDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const response = await addBrand(data);
    if (response.success) {
      getBrands();
      toast.success("Thêm thương hiệu thành công");
    } else {
      toast.error("Thêm thương hiệu thất bại");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thêm sản phẩm mới
          </h1>
          <p className="text-muted-foreground">
            Tạo sản phẩm mới cho cửa hàng của bạn.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SheetDemo
            buttonText="Thêm danh mục"
            title="Thêm danh mục"
            description="Thêm mới danh mục cho sản phẩm"
            onSubmit={onAddCategory}
          >
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid gap-3">
                <Label htmlFor="category-name">Tên danh mục</Label>
                <Input
                  id="category-name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="category-description">Mô tả danh mục</Label>
                <Input
                  id="category-description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
              </div>
            </div>
          </SheetDemo>
          <SheetDemo
            buttonText="Thêm thương hiệu"
            title="Thêm thương hiệu"
            description="Thêm mới thương hiệu cho sản phẩm"
            onSubmit={onAddBrand}
          >
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid gap-3">
                <Label htmlFor="brand-name">Tên thương hiệu</Label>
                <Input
                  id="brand-name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="brand-description">Mô tả thương hiệu</Label>
                <Input
                  id="brand-description"
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                />
              </div>
            </div>
          </SheetDemo>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onAddProduct)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên sản phẩm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá sản phẩm</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1000"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng sản phẩm</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <FormControl>
                        <ComboBox
                          data={categories}
                          type="category"
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thương hiệu</FormLabel>
                      <FormControl>
                        <ComboBox
                          data={brands}
                          type="brand"
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh sản phẩm</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          handleImageChange(e);
                        }}
                      />
                    </FormControl>
                    {previewImage && (
                      <div className="relative w-full">
                        <Image
                          src={previewImage}
                          alt="Preview"
                          width={300}
                          height={300}
                          className="rounded-lg object-contain"
                        />
                        <Button
                          variant="default"
                          size="icon"
                          className="absolute top-1 left-1 rounded-full"
                          onClick={() => {
                            setPreviewImage(null);
                            setImageFile(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả sản phẩm</FormLabel>
                    <FormControl>
                      <textarea
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Nhập mô tả sản phẩm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Đang thêm sản phẩm..." : "Thêm sản phẩm"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/products")}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
