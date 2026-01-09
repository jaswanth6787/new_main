import { Button } from "@/components/Button";
import heroLaddus from "@/assets/phase_1_2.png";

export function HeroSection() {
  const scrollToChecker = () => {
    const element = document.getElementById('cycle-phase-checker');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40"></div>

    <div className="container mx-auto px-4 py-20 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Seed Cycling Laddus
            </h1>
            <p className="font-heading text-2xl md:text-3xl text-wellness-green font-medium">
              Natural Hormone Balance for Women
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              ✨ Balance your hormones naturally with every bite.
            </p>
          </div>

          <div className="hidden lg:flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button variant="hero" onClick={scrollToChecker}>
              Order Your Laddus Now
            </Button>

          </div>
        </div>

        {/* Hero Image */}
        <div className="flex flex-col items-center justify-center lg:justify-end gap-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-wellness-pink/30 via-wellness-yellow/30 to-wellness-green-light/30 rounded-3xl blur-xl"></div>
            <img src={heroLaddus} alt="Phase I and Phase II Seed Cycling Laddus for natural hormone balance" className="relative w-full max-w-2xl h-auto object-contain drop-shadow-2xl" />
          </div>

          <div className="flex lg:hidden w-full justify-center">
            <Button variant="hero" className="w-full sm:w-auto" onClick={scrollToChecker}>
              Order Your Laddus Now
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Decorative elements */}
    <div className="absolute top-20 left-10 w-20 h-20 bg-wellness-pink/20 rounded-full blur-xl animate-pulse"></div>
    <div className="absolute bottom-20 right-10 w-32 h-32 bg-wellness-yellow/20 rounded-full blur-xl animate-pulse delay-1000"></div>
  </section>;
}