import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProofBar from "@/components/SocialProofBar";
import DemoVideo from "@/components/DemoVideo";
import HowItWorks from "@/components/HowItWorks";
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
        <DemoVideo />
        <HowItWorks />
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
