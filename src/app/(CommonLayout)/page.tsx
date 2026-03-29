import HeroSection from "@/components/home/Hero";
import CategoriesSection from "@/components/home/Categories";
import FeaturedTutorsSection from "@/components/home/Featured";
import HowItWorksSection from "@/components/home/Howitwork";
import TrustSection from "@/components/home/Trusted";

export default function HomePage() {
  return (
    <main className="relative bg-background">
      {/* Background decorations */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[1000px] overflow-hidden">
        <div className="absolute -left-[10%] top-[-5%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -right-[5%] top-[10%] h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="relative space-y-0">
        <HeroSection />
        
        <div className="bg-card/30 backdrop-blur-sm -mt-20 relative z-20 rounded-[4rem] px-4 md:px-0">
          <CategoriesSection />
        </div>

        <FeaturedTutorsSection />

        <div className="bg-background relative z-20 py-10">
          <HowItWorksSection />
        </div>

        <TrustSection />
      </div>
    </main>
  );
}
