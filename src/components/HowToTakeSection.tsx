import { Sun, Calendar } from "lucide-react";

export function HowToTakeSection() {
  return (
    <section className="py-20 bg-wellness-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            How to Use Seed Cycling Laddus
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Phase 1 Card */}
          <div className="bg-white/80 p-8 rounded-2xl shadow-card hover:shadow-hero transition-smooth">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-wellness-green-light/30 rounded-full flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-wellness-green" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-foreground">
                Phase 1 (Days 1–14)
              </h3>
            </div>
            <div className="flex items-start">
              <Sun className="w-5 h-5 text-wellness-green mr-3 mt-1 flex-shrink-0" />
              <p className="text-lg text-foreground leading-relaxed">
                Eat 1 laddu every morning on an empty stomach.
              </p>
            </div>
          </div>
          
          {/* Phase 2 Card */}
          <div className="bg-white/80 p-8 rounded-2xl shadow-card hover:shadow-hero transition-smooth">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-wellness-pink/30 rounded-full flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-wellness-pink" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-foreground">
                Phase 2 (Days 15–28)
              </h3>
            </div>
            <div className="flex items-start">
              <Sun className="w-5 h-5 text-wellness-pink mr-3 mt-1 flex-shrink-0" />
              <p className="text-lg text-foreground leading-relaxed">
                Eat 1 laddu every morning on an empty stomach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}