"use client";

import { useEffect, useState } from "react";
import { UserCheck, CheckCircle, XCircle } from "lucide-react";
import {
  getAdminUsers,
  approveTutor,
  rejectTutor,
} from "@/services/admin";

interface TutorProfile {
  id: string;
  userId: string;
  bio: string;
  experienceYears: number;
  hourlyRate: string;
  averageRating: number;
  totalReviews: number;
  isApproved: boolean;
  createdAt: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  isVerified: boolean;
  status: "ACTIVE" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
  tutorProfile: TutorProfile | null;
}

export default function PendingTutorsSection() {
  const [tutors, setTutors] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchTutors = async () => {
    try {
      setLoading(true);

      const res = await getAdminUsers(1, 50, "", "TUTOR");


      if (res.success && res.data) {
        const users = Array.isArray(res.data) ? res.data : (typeof res.data === 'object' && res.data !== null && 'data' in res.data ? (res.data as any).data : []) ?? [];


        const pendingTutors = users.filter(
          (user: AdminUser) =>
            user.role === "TUTOR" &&
            user.tutorProfile &&
            user.tutorProfile.isApproved === false
        );

        setTutors(pendingTutors.slice(0, 5));
      } else {
        setTutors([]);
      }
    } catch (error) {
      console.error("Failed to fetch tutors:", error);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setActionLoadingId(id);

      const res = await approveTutor(id);
      console.log(id)

      if (res.success) {
        setTutors((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert(res.message || "Approve failed");
      }
    } catch (error) {
      console.error(error);
      alert("Approve failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoadingId(id);

      const res = await rejectTutor(id);

      if (res.success) {
        setTutors((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert(res.message || "Reject failed");
      }
    } catch (error) {
      console.error(error);
      alert("Reject failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="font-bold flex items-center gap-2">
            <UserCheck className="h-4 w-4" /> Pending Tutor Approvals
          </h2>
          <span className="rounded-full bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5">
            {tutors.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading...</div>
        ) : tutors.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No pending tutors
          </div>
        ) : (
          tutors.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                {getInitials(t.name)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.email}</p>
                {t.tutorProfile?.bio && (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {t.tutorProfile.bio}
                  </p>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(t.id)}
                  disabled={actionLoadingId === t.id}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:opacity-80 disabled:opacity-50 dark:bg-emerald-900/30 dark:text-emerald-400"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  {actionLoadingId === t.id ? "Processing..." : "Approve"}
                </button>

                <button
                  onClick={() => handleReject(t.id)}
                  disabled={actionLoadingId === t.id}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:opacity-80 disabled:opacity-50 dark:bg-rose-900/30 dark:text-rose-400"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}