import CategoriesSection from "@/components/home/Categories";
import FeaturedTutorsSection from "@/components/home/Featured";
import HeroSection from "@/components/home/Hero";
import HowItWorksSection from "@/components/home/Howitwork";
import TrustSection from "@/components/home/Trusted";

export default function page() {
  return (
    <div>
   <HeroSection />
   <CategoriesSection />
   <FeaturedTutorsSection />
   <HowItWorksSection />
   <TrustSection />
    </div>
  )
}
