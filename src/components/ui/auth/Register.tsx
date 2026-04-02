"use client";
import { useState, useRef } from "react"; // useRef যোগ করা হয়েছে
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, Field, SubmitBtn, ErrorBox, OrDivider, GoogleBtn } from "@/components/ui/auth/AuthLayout";
import { toast } from "sonner";
import { registerUser } from "@/services/auth";
import { Camera, X } from "lucide-react"; // আইকন

export default function RegisterContent() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref যোগ করা হয়েছে

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- Cloudinary Upload Function ---
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_preset_name"); // আপনার Cloudinary Preset নাম দিন

    const res = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url; // এটি ইমেজ এর লিং দিবে
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = "";
      
      // যদি ইমেজ সিলেক্ট করা থাকে তবে আপলোড হবে
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      // এখন imageUrl টি ব্যাকএন্ডে পাঠানো হচ্ছে
      const res = await registerUser({ 
        name, 
        email, 
        password, 
        image: imageUrl // এখানে URL চলে যাচ্ছে
      });

      if (!res.success) throw new Error(res.message);

      toast.success("Registration successful! Redirecting to login...");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      toast.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Create account.</h1>
        <p className="mt-2 text-muted-foreground text-sm">Join thousands of learners and tutors today.</p>
      </div>
      <form onSubmit={handleSubmit}>
        {error && <ErrorBox msg={error} />}

        {/* --- Image Upload UI --- */}
        <div className="flex flex-col items-center justify-center space-y-3 mb-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative h-24 w-24 cursor-pointer group"
          >
            <div className="h-full w-full rounded-full border-2 border-dashed border-primary/30 bg-muted flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto h-8 w-8 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Upload</span>
                </div>
              )}
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-1 shadow-lg"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <Field label="Full name" type="text" value={name} onChange={setName} placeholder="John Doe" />
        <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="student@tutorbyte.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 8 characters" />
        <Field label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Must match password" />

        <div className="mt-6">
          <SubmitBtn loading={loading}>Create Account</SubmitBtn>
        </div>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
      <OrDivider />
      <GoogleBtn />
    </AuthShell>
  );
}