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
import { Textarea } from "@/components/ui/textarea";

import { useAuth } from "@/lib/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "Họ phải có ít nhất 2 ký tự"),
  lastName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  district: z.string().min(2, "Quận/Huyện phải có ít nhất 2 ký tự"),
  province_city: z.string().min(2, "Tỉnh/Thành phố phải có ít nhất 2 ký tự"),
  // zipCode: z.string().min(5, "Mã bưu điện phải có ít nhất 5 ký tự"),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { isAdmin } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: isAdmin ? "Admin" : "Nguyễn",
      lastName: isAdmin ? "User" : "Văn A",
      email: isAdmin ? "admin@ecomstore.com" : "nguyenvan@example.com",
      phone: "09xxxxxxxx",
      address: "123 Đường Cách Mạng Tháng 8",
      district: "Bình Thạnh",
      province_city: "TP.HCM",
      // zipCode: "10001",
      bio: isAdmin ? "Quản trị viên" : "Là khách hàng từ 2024",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // Simulate API call
      toast.loading("Đang cập nhật thông tin...");

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Profile updated:", values);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
    }
  };

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
          <h1 className="text-3xl font-bold">Thông tin tài khoản</h1>
          <p className="text-muted-foreground">Quản lý thông tin tài khoản</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tổng quan tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                  <User className="text-primary h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold">
                  {form.watch("firstName")} {form.watch("lastName")}
                </h3>
                <p className="text-muted-foreground">{form.watch("email")}</p>
                {isAdmin && (
                  <span className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Quản trị viên
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <span>{form.watch("email")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <span>{form.watch("phone")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span>
                    {form.watch("district")}, {form.watch("province_city")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>Thành viên từ tháng 1 năm 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Thống kê tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng số đơn hàng</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng tiền đã mua</span>
                <span className="font-semibold">12.000.000 đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Số lượng sản phẩm yêu thích
                </span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Điểm thưởng</span>
                <span className="font-semibold">1,248 điểm</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Chỉnh sửa thông tin</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Thông tin cá nhân</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="nguyenvan@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="09xxxxxxxx"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giới thiệu</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nói về bản thân..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Địa chỉ</h3>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Đường Cách Mạng Tháng 8"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quận/Huyện</FormLabel>
                            <FormControl>
                              <Input placeholder="Bình Thạnh" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="province_city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                            <FormControl>
                              <Input placeholder="TP.HCM" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="flex-1"
                    >
                      {form.formState.isSubmitting
                        ? "Đang cập nhật..."
                        : "Cập nhật thông tin"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Đặt lại
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
