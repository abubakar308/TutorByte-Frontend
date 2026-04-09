import HeroSection from "@/components/ui/home/Hero";
import StatsSection from "@/components/ui/home/Stats";
import CategoriesSection from "@/components/ui/home/Categories";
import FeaturedTutorsSection from "@/components/ui/home/Featured";
import HowItWorksSection from "@/components/ui/home/Howitwork";
import TrustSection from "@/components/ui/home/Trusted";
import BlogPreviewSection from "@/components/ui/home/BlogPreviewSection";
import WhyChooseTutorByteSection from "@/components/ui/home/WHyChooseTutorbyte";

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
        <StatsSection />
        
        <div className="bg-card/30 backdrop-blur-sm mt-8 relative z-20 rounded-[4rem] px-4 md:px-0">
          <CategoriesSection />
        </div>

        <FeaturedTutorsSection />

        <div className="bg-background relative z-20 py-10">
          <HowItWorksSection />

          <WhyChooseTutorByteSection />

          <BlogPreviewSection />

        </div>

        <TrustSection />
      </div>
    </main>
  );
}
