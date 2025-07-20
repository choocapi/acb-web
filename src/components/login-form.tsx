"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Vui lòng điền đầy đủ các trường");
      return;
    }
    const res = await login(email, password);
    if (res.success) {
      toast.success(res.message);
      router.push("/");
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
        handleLogin();
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Đăng nhập vào tài khoản</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Nhập email của bạn dưới đây để đăng nhập vào tài khoản
        </p>
      </div>
      <div className="grid gap-6">
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
          <div className="flex items-center">
            <Label htmlFor="password">Mật khẩu</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Đăng nhập
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Hoặc tiếp tục với
          </span>
        </div>
        <Button variant="outline" className="w-full">
          Đăng nhập bằng Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Không có tài khoản?{" "}
        <a href="/sign-up" className="underline underline-offset-4">
          Đăng ký
        </a>
      </div>
    </form>
  );
}
