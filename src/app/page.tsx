import PricingComparator from "@/landing/compare";
import Features from "@/landing/features";
import HeroSection from "@/landing/hero";
import PricingTwo from "@/landing/pricing";
import CallToAction from "@/landing/start";

export default function Home() {
  return (
  <div className="h-screen flex flex-col">
    <HeroSection />
    <PricingTwo />
    <PricingComparator />
    <Features />
    <CallToAction />
  </div>
  );
}