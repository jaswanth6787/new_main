import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    age: 28,
    quote: "I feel more energetic and balanced since using these laddus! My PMS symptoms have reduced significantly.",
    rating: 5,
    location: "Hyderabad"
  },
  {
    name: "Anjali Patel",
    age: 34,
    quote: "Finally, a natural solution that actually tastes good! My sleep has improved and I feel more like myself.",
    rating: 5,
    location: "Hyderabad"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join thousands of women who have transformed their cycles naturally
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-wellness-cream/50 p-8 rounded-2xl shadow-card hover:shadow-hero transition-smooth hover:scale-105"
            >
              {/* Rating Stars */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-wellness-green fill-current" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-foreground text-center mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              {/* Customer Info */}
              <div className="text-center">
                <div className="w-16 h-16 bg-wellness-green-light/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-wellness-green font-semibold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h4 className="font-heading text-lg font-semibold text-foreground">
                  {testimonial.name}
                </h4>
                <p className="text-muted-foreground text-sm">
                  Age {testimonial.age}, {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-wellness-green-light/30 p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">
              Join Our Happy Community
            </h3>
            <p className="text-lg text-muted-foreground mb-4">
              The women trust our laddus for their hormone balance journey
            </p>
            <div className="flex justify-center items-center space-x-4 text-wellness-green">
              <Star className="w-6 h-6 fill-current" />
              <span className="text-2xl font-bold">4.7/5</span>
              <span className="text-muted-foreground">Average Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}