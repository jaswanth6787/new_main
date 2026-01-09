import { Flower2, Sparkles, Moon, Leaf, Shield } from "lucide-react";

const benefits = [
  {
    icon: Flower2,
    title: "Balance PCOD/PCOS",
    description: "Supports hormonal balance and helps regulate menstrual cycles"
  },
  {
    icon: Sparkles,
    title: "Fertility Support",
    description: "Care for your reproductive system with nourishing nutrients that support your fertility journey."
  },
  {
    icon: Shield,
    title: "PMS Relief",
    description: "Reduce mood swings, bloating, and other uncomfortable PMS symptoms"
  },
  {
    icon: Sparkles,
    title: "Glowing Skin",
    description: "Achieve clearer, more radiant skin through balanced hormones"
  },
  {
    icon: Moon,
    title: "Better Sleep",
    description: "Improve sleep quality and reduce nighttime restlessness"
  },
  {
    icon: Leaf,
    title: "Natural Nutrients",
    description: "Rich in omega-3s, lignans, vitamins, and minerals your body needs"
  }
];

export function BenefitsSection() {
  return (
    <section className="py-20 soft-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Benefits of Seed Cycling Laddus
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover how our specially crafted laddus can transform your monthly cycle and overall well-being
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-card hover:shadow-hero transition-smooth hover:scale-105"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-wellness-green/10 rounded-2xl mb-6 mx-auto">
                  <Icon className="w-8 h-8 text-wellness-green" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4 text-center">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}