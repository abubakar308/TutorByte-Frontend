import { getCurrentUser } from '@/services/auth';
import { redirect } from 'next/navigation';
import React from 'react';
import FloatingChatBot from "@/components/ui/ai/FloatingChatBot";

export const dynamic = "force-dynamic";

const DashboardLayout = async ({
  admin,
  student,
  tutor,
}: {
  admin: React.ReactNode;
  student: React.ReactNode;
  tutor: React.ReactNode;
}) => {
  const user = await getCurrentUser();

  // Redirect to login if user is not authenticated
  if (!user) {
    redirect('/login');
  }

  const Roles = user?.role;

  return (
    <div className="relative min-h-screen">
      {Roles === "STUDENT" && student}
      {Roles === "TUTOR" && tutor}
      {Roles === "ADMIN" && admin}
      
      <FloatingChatBot />
    </div>
  );
};

export default DashboardLayout;