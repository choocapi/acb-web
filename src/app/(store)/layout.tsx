import Navbar from "@/components/navbar";
import FooterSection from "@/components/sections/footer/default";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main>{children}</main>
      <FooterSection />
    </div>
  );
}
