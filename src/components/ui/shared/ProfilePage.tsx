"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  BadgeCheck,
  Settings,
  Clock,
  Camera,
  Loader2,
  X,
  Check,
  MapPin,
  Phone,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { uploadUserAvatar, updateStudentProfile } from "@/services/student";
import { uploadTutorAvatar, updateTutorProfile } from "@/services/tutor";
import { useRouter } from "next/navigation";

interface ProfilePageProps {
  initialData: any;
}

export default function ProfilePage({ initialData }: ProfilePageProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: profile.name || "",
    bio: profile.studentProfile?.bio || profile.tutorProfile?.bio || "",
  });

  const getInitials = (name: string) =>
    name
      ? name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      let res;
      if (profile.role === "STUDENT" || profile.role === "ADMIN") {
        res = await uploadUserAvatar(file);
      } else if (profile.role === "TUTOR") {
        res = await uploadTutorAvatar(file);
      }

      if (res?.success) {
        setProfile((prev: any) => ({ ...prev, image: res.data?.avatarUrl }));
        toast.success("Avatar updated successfully", {
          description: "Your new profile picture is now visible.",
        });
        router.refresh();
      } else {
        throw new Error(res?.message || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate bio length for Tutors (Backend requirement: min 50 characters)
    if (profile.role === "TUTOR" && formData.bio && formData.bio.length < 50) {
      toast.error("Bio must be at least 50 characters long", {
        description: "Please provide a more detailed professional description.",
      });
      return;
    }

    try {
      setLoading(true);
      
      // 1. Update general user info (Name) - Shared across all roles
      const userRes = await updateStudentProfile({ name: formData.name });
      
      if (!userRes?.success) {
        throw new Error(userRes?.message || "Failed to update user info");
      }

      // 2. Update role-specific info (Bio) - Only for Tutors
      if (profile.role === "TUTOR") {
        const tutorRes = await updateTutorProfile({ bio: formData.bio });
        if (!tutorRes?.success) {
          throw new Error(tutorRes?.message || "Failed to update professional bio");
        }
      }

      // Success!
      toast.success("Profile updated successfully", {
        icon: <Check className="h-4 w-4 text-emerald-500" />,
        description: "Changes have been saved and synchronized.",
      });
      
      setIsEditing(false);
      router.refresh();
      
      // Re-fetch or update local state if needed
      setProfile((prev: any) => ({ 
        ...prev, 
        name: formData.name,
        tutorProfile: prev.tutorProfile ? { ...prev.tutorProfile, bio: formData.bio } : undefined,
        studentProfile: prev.studentProfile ? { ...prev.studentProfile, bio: formData.bio } : undefined,
      }));

    } catch (error: any) {
      toast.error(error.message || "Failed to update profile", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8 animate-in fade-in duration-700">
      {/* Profile Header Deck */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl shadow-primary/5">
        {/* Animated Background Header */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-primary/40">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
        </div>

        <div className="relative px-6 pb-10 md:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            {/* Avatar Section */}
            <div className="relative -mt-20 group">
              <div
                className={`relative h-40 w-40 cursor-pointer overflow-hidden rounded-[2.5rem] border-8 border-card bg-muted shadow-2xl transition-all duration-500 group-hover:scale-[1.02] ${
                  uploading ? "opacity-60" : ""
                }`}
                onClick={handleAvatarClick}
              >
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-5xl font-black text-primary/40">
                    {getInitials(profile.name)}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-sm">
                  {uploading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                       <Camera className="h-8 w-8 text-white animate-in zoom-in" />
                       <span className="text-[10px] font-bold uppercase tracking-tighter text-white">Change Photo</span>
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              
              {/* Verified Badge */}
              {profile.isVerified && (
                <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg ring-4 ring-card animate-in zoom-in duration-500 delay-300">
                  <BadgeCheck size={20} />
                </div>
              )}
            </div>

            {/* Profile Brief */}
            <div className="mb-2 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black tracking-tight text-foreground">
                  {profile.name}
                </h1>
                <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary ring-1 ring-primary/20">
                  {profile.role}
                </span>
                {profile.status !== "ACTIVE" && (
                   <span className="rounded-full bg-rose-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-rose-500 ring-1 ring-rose-500/20">
                     {profile.status}
                   </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2 transition-colors hover:text-foreground">
                  <Mail className="h-4 w-4 text-primary" /> {profile.email}
                </div>
                <div className="flex items-center gap-2 transition-colors hover:text-foreground">
                  <Calendar className="h-4 w-4 text-primary" /> Joined {formatDate(profile.createdAt)}
                </div>
              </div>
            </div>

            {/* Header Actions */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex h-14 items-center gap-3 rounded-2xl bg-foreground px-8 text-sm font-black text-background shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <Settings className="h-5 w-5" /> Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition-all hover:bg-muted/50 active:scale-95"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar Info */}
        <div className="space-y-8 lg:col-span-1">
          {/* Account Health Card */}
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl shadow-primary/5">
            <h3 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Account Overview
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Status</p>
                    <p className="text-sm font-bold text-foreground">{profile.status}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Member Since</p>
                    <p className="text-sm font-bold text-foreground">{new Date(profile.createdAt).getFullYear()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Verification</p>
                    <p className="text-sm font-bold text-foreground">
                      {profile.isVerified ? "Platinum Verified" : "Standard"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick ID Card */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-dashed border-border bg-muted/20 p-8 transition-colors hover:border-primary/40">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <AlertCircle size={48} />
            </div>
            <h3 className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">System Identifier</h3>
            <code className="block break-all text-[11px] font-mono font-bold text-primary">
              {profile.id}
            </code>
          </div>
        </div>

        {/* Dynamic Detail Card */}
        <div className="lg:col-span-2">
          <div className="rounded-[2.5rem] border border-border bg-card p-8 md:p-12 shadow-xl shadow-primary/5 h-full">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                   <h2 className="text-2xl font-black text-foreground">Edit Account Details</h2>
                   <p className="text-sm text-muted-foreground">Keep your personal information up to date to ensure the best experience.</p>
                </div>

                <div className="grid gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Display Name</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-14 w-full rounded-2xl border border-border bg-muted/20 pl-12 pr-4 text-sm font-bold outline-none ring-primary/20 transition-all focus:border-primary focus:bg-card focus:ring-4"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {profile.role === "TUTOR" && (
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Professional Bio</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-5 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <Briefcase size={18} />
                        </div>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows={6}
                          className="w-full rounded-2xl border border-border bg-muted/20 pl-12 pr-4 py-4 text-sm font-medium leading-relaxed outline-none ring-primary/20 transition-all focus:border-primary focus:bg-card focus:ring-4"
                          placeholder="Tell us about your teaching experience and expertise..."
                        />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground">This will be visible on your public tutor profile.</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-primary h-14 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                    Save Profile Updates
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center gap-3 rounded-2xl border border-border h-14 px-8 text-sm font-black text-foreground transition-all hover:bg-muted active:scale-95"
                  >
                    Discard Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
                 {/* Bio Section */}
                {(profile.role === "TUTOR" || profile.bio) && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <h3 className="text-xs font-black uppercase tracking-widest text-primary">About Me</h3>
                       <div className="h-px flex-1 bg-border" />
                    </div>
                    <p className="text-lg font-medium leading-relaxed text-foreground/80 italic">
                      "{formData.bio || "No biography provided yet. Add one to help users get to know you better!"}"
                    </p>
                  </div>
                )}

                {/* Additional Metadata Grid */}
                <div className="grid gap-8 sm:grid-cols-2">
                   <div className="rounded-3xl bg-muted/30 p-6 space-y-4 ring-1 ring-border">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                         <Phone size={24} />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Contact Reference</h4>
                        <p className="text-sm font-bold text-foreground">Registered via {profile.email}</p>
                      </div>
                   </div>

                   <div className="rounded-3xl bg-muted/30 p-6 space-y-4 ring-1 ring-border">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                         <MapPin size={24} />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Primary Location</h4>
                        <p className="text-sm font-bold text-foreground">Global Access Enabled</p>
                      </div>
                   </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-transparent p-8 border border-primary/10">
                   <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                         <Mail size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-black tracking-tight text-foreground">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Account alerts are sent to {profile.email}</p>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}