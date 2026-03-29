export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to- from-green-50 via-white to-emerald-100 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white/90 backdrop-blur p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
        {children}
      </div>
    </div>
  );
}