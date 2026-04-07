"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  UserCheck, CheckCircle, XCircle, Eye, Mail, 
  Calendar, Star, Briefcase, DollarSign, X 
} from "lucide-react";
import {
  getAdminUsers,
  approveTutor,
  rejectTutor,
} from "@/services/admin";
import Image from "next/image";

// --- Interfaces ---
interface TutorProfile {
  id: string;
  bio: string;
  experienceYears: number;
  hourlyRate: string;
  averageRating: number;
  totalReviews: number;
  isApproved: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  isVerified: boolean;
  status: string;
  createdAt: string;
  tutorProfile: TutorProfile | null;
}

export default function TutorsManagement() {
  const [tutors, setTutors] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<AdminUser | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchTutors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers(1, 50, "", "TUTOR");

      if (res.success && res.data) {
        // API response structure: res.data.data
        const rawData = (res.data as any).data || res.data || [];
        setTutors(rawData);
      }
    } catch (error) {
      console.error("Failed to fetch tutors:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    try {
      setActionLoadingId(id);
      const res = action === "APPROVE" ? await approveTutor(id) : await rejectTutor(id);

      if (res.success) {
        setTutors((prev) =>
          prev.map((t) =>
            t.id === id 
              ? { ...t, tutorProfile: t.tutorProfile ? { ...t.tutorProfile, isApproved: action === "APPROVE" } : null } 
              : t
          )
        );
        setSelectedTutor(null); // Close modal on success
      } else {
        alert(res.message || `${action} failed`);
      }
    } catch (error) {
      alert("Operation failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/10">
        <h2 className="font-bold flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" /> Tutor Management
        </h2>
        <span className="text-xs font-medium text-muted-foreground">{tutors.length} Total Tutors</span>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-12 text-center animate-pulse text-muted-foreground">Loading Tutors List...</div>
        ) : tutors.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No tutors found</div>
        ) : (
          tutors?.map((t) => (
            <div key={t.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition">
                   <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center border border-border">
                               {t?.image ? (
                                 <img src={t.image} alt={t.name} className="object-cover" sizes="44px" />
                               ) : (
                                 <span className="text-sm font-bold text-primary">{getInitials(t.name)}</span>
                               )}
                             </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm truncate">{t.name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                    t.tutorProfile?.isApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {t.tutorProfile?.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{t.email}</p>
              </div>

              <button
                onClick={() => setSelectedTutor(t)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-xl text-xs font-bold transition"
              >
                <Eye className="h-3.5 w-3.5" /> View Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* --- View Details Modal --- */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="relative h-24 bg-gradient-to-r from-primary/20 to-secondary/20">
              <button 
                onClick={() => setSelectedTutor(null)}
                className="absolute top-4 right-4 p-2 bg-background/50 rounded-full hover:bg-background transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-8 pb-8">
              <div className="relative -mt-10 mb-4">
                <div className="h-20 w-20 rounded-2xl border-4 border-card bg-muted flex items-center justify-center overflow-hidden shadow-lg relative">
                   {selectedTutor.image ? <Image src={selectedTutor.image} alt="" fill className="object-cover" /> : <span className="text-2xl font-bold">{getInitials(selectedTutor.name)}</span>}
                </div>
              </div>

              <h3 className="text-xl font-black">{selectedTutor.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="h-3.5 w-3.5" /> {selectedTutor.email}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 rounded-2xl bg-muted/50 border border-border">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Experience</p>
                  <p className="font-bold flex items-center gap-1"><Briefcase className="h-3 w-3" /> {selectedTutor.tutorProfile?.experienceYears || 0} Years</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/50 border border-border">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Rate</p>
                  <p className="font-bold flex items-center gap-1"><DollarSign className="h-3 w-3" /> ${selectedTutor.tutorProfile?.hourlyRate || 0}/hr</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Bio / About</p>
                <p className="text-sm text-muted-foreground leading-relaxed italic bg-muted/30 p-4 rounded-2xl border border-border">
                  "{selectedTutor.tutorProfile?.bio || "No bio provided."}"
                </p>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex gap-3 mt-8">
                {!selectedTutor.tutorProfile?.isApproved ? (
                  <>
                    <button
                      onClick={() => handleAction(selectedTutor.id, "APPROVE")}
                      disabled={!!actionLoadingId}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" /> {actionLoadingId === selectedTutor.id ? "Wait..." : "Approve Tutor"}
                    </button>
                    <button
                      onClick={() => handleAction(selectedTutor.id, "REJECT")}
                      disabled={!!actionLoadingId}
                      className="flex-1 flex items-center justify-center gap-2 bg-rose-100 text-rose-600 py-3 rounded-2xl font-bold hover:bg-rose-200 transition disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleAction(selectedTutor.id, "REJECT")}
                    className="w-full flex items-center justify-center gap-2 border border-rose-200 text-rose-600 py-3 rounded-2xl font-bold hover:bg-rose-50 transition"
                  >
                    <XCircle className="h-4 w-4" /> Revoke Approval (Reject)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}