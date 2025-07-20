import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetDemo({
  buttonText,
  title,
  description,
  children,
  onSubmit,
}: {
  buttonText: string;
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: () => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default">{buttonText}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
        <SheetFooter>
          <Button type="button" onClick={onSubmit}>
            Lưu
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Đóng</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
