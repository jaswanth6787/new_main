import { HeroSection } from "@/components/HeroSection";
import { WhatIsSeedCycling } from "@/components/WhatIsSeedCycling";
import { PhaseSection } from "@/components/PhaseSection";
import { CycleCompanion } from "@/components/CycleCompanion";
import { BenefitsSection } from "@/components/BenefitsSection";
import { CycleTimeline } from "@/components/CycleTimeline";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";


import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen">


      <Navbar />
      <HeroSection />

      <WhatIsSeedCycling />

      <PhaseSection
        phase={1}
        title="Phase I Laddu"
        description="Specially crafted with flaxseeds and pumpkin seeds to support your follicular phase. These nutrient-dense laddus help boost estrogen levels naturally and support healthy ovulation."
        benefits={[
          "Supports healthy estrogen balance",
          "Helps regulate ovulation (beneficial for PCOD/PCOS)",
          "Reduces inflammation and hormonal imbalance",
          "Rich in omega-3 fatty acids for skin and metabolic support"
        ]}
        days="Days 1-14"
        time="morning"
        backgroundColor="bg-wellness-green-light/20"
      />

      <PhaseSection
        phase={2}
        title="Phase II Laddu"
        description="Formulated with sesame seeds and sunflower seeds to nourish your luteal phase. These delicious laddus help support progesterone production and reduce PMS symptoms."
        benefits={[
          "Supports natural progesterone production",
          "Helps reduce PMS and mood swings (useful for PCOD/PCOS)",
          "Supports better sleep and stress balance",
          "Rich in vitamin E and antioxidants for reproductive health"
        ]}
        days="Days 15-28"
        time="morning"
        backgroundColor="bg-wellness-pink/20"
      />

      <CycleCompanion />

      <CycleTimeline />

      <BenefitsSection />



      <WhyChooseSection />

      <TestimonialsSection />

      <FAQSection />

      <CTASection />
    </div>
  );
};

export default Index;
