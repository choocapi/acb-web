"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hook";
import { signUp } from "@/lib/features/auth/authThunks";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleResgiter = async () => {
    if (!fullName || !email || !phone || !password) {
      toast.error("Vui lòng điền đầy đủ các trường");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu và mật khẩu xác nhận không khớp");
      return;
    }
    const res = await dispatch(
      signUp({ fullName, email, phone, password })
    ).unwrap();
    if (res.success) {
      toast.success(res.message);
      router.push("/login");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        handleResgiter();
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Nhập email của bạn dưới đây để tạo tài khoản
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            type="text"
            placeholder="0xxxxxxxxx"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Mật khẩu</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Xác nhận mật khẩu</Label>
          </div>
          <Input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Đăng ký
        </Button>
      </div>
      <div className="text-center text-sm">
        Đã có tài khoản?{" "}
        <a href="/login" className="underline underline-offset-4">
          Đăng nhập
        </a>
      </div>
    </form>
  );
}
