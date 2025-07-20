"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAdmin, user } = useAuth();
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
