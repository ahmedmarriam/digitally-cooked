import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProofBar from "@/components/SocialProofBar";
import WhatWeActuallyDo from "@/components/WhatWeActuallyDo";
import DemoVideo from "@/components/DemoVideo";
import HowItWorks from "@/components/HowItWorks";
import ComparisonSection from "@/components/ComparisonSection";
import AutoPostingSection from "@/components/AutoPostingSection";
import ProductScreenshots from "@/components/ProductScreenshots";
import WhatYouGet from "@/components/WhatYouGet";
import BeforeAfter from "@/components/BeforeAfter";
import Platforms from "@/components/Platforms";
import SampleOutput from "@/components/SampleOutput";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProofBar />
        <WhatWeActuallyDo />
        <DemoVideo />
        <HowItWorks />
        <ComparisonSection />
        <AutoPostingSection />
        <ProductScreenshots />
        <WhatYouGet />
        <BeforeAfter />
        <Platforms />
        <SampleOutput />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
