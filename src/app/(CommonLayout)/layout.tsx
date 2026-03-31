import Footer from "@/components/ui/shared/Footer";
import Navbar from "@/components/ui/shared/Navbar";
import { getCurrentUser } from "@/services/auth";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
        <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}