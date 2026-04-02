"use client";

import Image from "next/image";
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  BadgeCheck, 
  Settings, 
  Clock 
} from "lucide-react";
// আপনার দেওয়া ডাটা অনুযায়ী ইন্টারফেস
interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  isVerified: boolean;
  status: string;
  createdAt: string;
  tutorProfile: any;
}

export default function ProfilePage() {
  // আপনার প্রোভাইড করা স্যাম্পল ডাটা
  const profile: ProfileData = {
    id: "Xd4V7jTqih35dABSJg9WtQ2KDoYcJph6",
    name: "Student 1",
    email: "student1@gmail.com",
    role: "STUDENT",
    image: null,
    isVerified: false,
    status: "ACTIVE",
    createdAt: "2026-04-01T12:47:23.097Z",
    tutorProfile: null,
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        {/* Header/Cover Gradient */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row md:items-end gap-6 -mt-12">
            {/* Profile Image Logic */}
            <div className="relative h-32 w-32 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden shadow-md">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-4xl font-black text-primary/40">
                  {getInitials(profile.name)}
                </span>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-foreground">
                  {profile.name}
                </h1>
                {profile.isVerified ? (
                  <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/10" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-muted-foreground" title="Not Verified" />
                )}
              </div>
              <p className="text-muted-foreground flex items-center gap-2 font-medium">
                <Mail className="h-4 w-4" /> {profile.email}
              </p>
            </div>

            {/* Update Button */}
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg shadow-primary/20">
              <Settings className="h-4 w-4" /> Update Profile
            </button>
          </div>

          <hr className="my-8 border-border" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Account Role</p>
                <p className="font-bold text-foreground">{profile.role}</p>
              </div>
            </div>

            {/* Status Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                profile.status === "ACTIVE" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
              }`}>
                {profile.status === "ACTIVE" ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Account Status</p>
                <p className="font-bold text-foreground">{profile.status}</p>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Joined On</p>
                <p className="font-bold text-foreground">{formatDate(profile.createdAt)}</p>
              </div>
            </div>

            {/* Last Updated (Using createdAt for placeholder) */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Verification Status</p>
                <p className="font-bold text-foreground">
                  {profile.isVerified ? "Verified User" : "Pending Verification"}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-8 p-6 rounded-2xl border border-dashed border-border bg-muted/10">
            <h3 className="font-bold text-sm mb-2">Account ID</h3>
            <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {profile.id}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}