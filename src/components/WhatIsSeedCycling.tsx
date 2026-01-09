import cycleInfographic from "@/assets/cycle_infographic.png";

export function WhatIsSeedCycling() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            What is Seed Cycling?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Seed cycling is a natural method that supports hormonal balance by consuming specific seeds during different phases of the menstrual cycle.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img 
              src={cycleInfographic} 
              alt="28-day menstrual cycle showing Phase I (Day 1-14) and Phase II (Day 15-28)"
              className="w-full max-w-lg h-auto shadow-card rounded-2xl"
            />
          </div>
          
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="bg-wellness-green-light/30 p-6 rounded-2xl">
                <h3 className="font-heading text-2xl font-semibold text-wellness-green mb-3">
                  Phase I: Days 1-14
                </h3>
                <p className="text-lg text-foreground">
                  During your follicular phase, flaxseeds and pumpkin seeds help support estrogen production and healthy ovulation.
                </p>
              </div>
              
              <div className="bg-wellness-pink/30 p-6 rounded-2xl">
                <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">
                  Phase II: Days 15-28
                </h3>
                <p className="text-lg text-foreground">
                  During your luteal phase, sesame seeds and sunflower seeds help support progesterone production and reduce PMS symptoms.
                </p>
              </div>
            </div>
            
            <div className="bg-wellness-yellow/30 p-6 rounded-2xl">
              <p className="text-lg text-foreground font-medium">
                Our laddus turn healthy seeds into a tasty treat you'll actually look forward to every day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}