import phase1Ingredients from "@/assets/phase_1_transprant.png";
import phase2Ingredients from "@/assets/Phase_2_transprant.png";

interface PhaseSectionProps {
  phase: 1 | 2;
  title: string;
  description: string;
  benefits: string[];
  days: string;
  time: string;
  backgroundColor: string;
}

export function PhaseSection({
  phase,
  title,
  description,
  benefits,
  days,
  time,
  backgroundColor
}: PhaseSectionProps) {
  const image = phase === 1 ? phase1Ingredients : phase2Ingredients;
  const isPhase1 = phase === 1;

  return (
    <section className={`py-20 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isPhase1 ? 'lg:grid-flow-col-reverse' : ''}`}>
          {/* Image */}
          <div className={`flex justify-center ${!isPhase1 ? 'lg:order-2' : ''}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-wellness-green/20 via-wellness-yellow/20 to-wellness-pink/20 rounded-3xl blur-xl"></div>
              <img
                src={image}
                alt={`Phase ${phase} Laddu with ${phase === 1 ? 'flaxseeds and pumpkin seeds' : 'sesame seeds and sunflower seeds'}`}
                className="relative w-full max-w-lg h-auto object-contain shadow-card rounded-2xl"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-8 ${!isPhase1 ? 'lg:order-1' : ''}`}>
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                {title}
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {description}
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-white/50 p-6 rounded-2xl shadow-soft">
                <h3 className="font-heading text-xl font-semibold text-wellness-green mb-3">
                  When to Take
                </h3>
                <p className="text-lg text-foreground">
                  <span className="font-semibold">{days.replace("-", "–")}:</span> Enjoy one laddu every {time}.
                </p>
              </div>

              <div className="bg-white/50 p-6 rounded-2xl shadow-soft">
                <h3 className="font-heading text-xl font-semibold text-wellness-green mb-3">
                  Key Benefits
                </h3>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-lg text-foreground">
                      <span className="w-2 h-2 bg-wellness-green rounded-full mr-3"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}