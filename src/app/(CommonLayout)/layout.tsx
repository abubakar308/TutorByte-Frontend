import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { getCurrentUser } from "@/services/auth";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const user = await getCurrentUser();

   console.log(user)

  return (
    <div className="flex min-h-screen flex-col bg-background">
        <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}