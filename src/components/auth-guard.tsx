"use client";

import { useAppSelector } from "@/lib/hook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin || !user) {
      router.push("/");
    }
  }, [isAdmin, router, user]);

  if (!isAdmin || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Truy cập bị từ chối</h1>
          <p className="text-muted-foreground">
            Bạn cần quyền admin để truy cập trang này.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
