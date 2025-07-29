"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "../../ui/footer";
import { ModeToggle } from "../../ui/mode-toggle";
import { ShoppingBag } from "lucide-react";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: ReactNode;
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  showModeToggle?: boolean;
  className?: string;
}

export default function FooterSection({
  logo = <ShoppingBag className="h-6 w-6" />,
  name = "ACB Computer",
  columns = [
    {
      title: "Sản phẩm",
      links: [
        { text: "Changelog", href: "" },
        { text: "Tài liệu", href: "" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "Giới thiệu", href: "" },
        { text: "Tuyển dụng", href: "" },
        { text: "Blog", href: "" },
      ],
    },
    {
      title: "Contact",
      links: [
        { text: "Facebook", href: "" },
        { text: "Tiktok", href: "" },
        { text: "Instagram", href: "" },
      ],
    },
  ],
  copyright = "© 2025 ACB Computer. All rights reserved",
  policies = [
    { text: "Điều khoản và điều kiện", href: "" },
    { text: "Chính sách bảo mật", href: "" },
  ],
  showModeToggle = true,
  className,
}: FooterProps) {
  return (
    <footer className={cn("bg-background w-full border-t px-4", className)}>
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">
                {logo}
                <h3 className="text-xl font-bold">{name}</h3>
              </div>
            </FooterColumn>
            {columns.map((column, index) => (
              <FooterColumn key={index}>
                <h3 className="text-md pt-1 font-semibold">{column.title}</h3>
                {column.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="text-muted-foreground text-sm"
                  >
                    {link.text}
                  </a>
                ))}
              </FooterColumn>
            ))}
          </FooterContent>
          <FooterBottom>
            <div>{copyright}</div>
            <div className="flex items-center gap-4">
              {policies.map((policy, index) => (
                <a key={index} href={policy.href}>
                  {policy.text}
                </a>
              ))}
              {showModeToggle && <ModeToggle />}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
