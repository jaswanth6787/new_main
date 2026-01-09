import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "Is seed cycling safe?",
    answer: "Yes, seed cycling is completely safe and natural. Our laddus are made with 100% natural ingredients - flaxseeds, pumpkin seeds, sesame seeds, and sunflower seeds. These are whole foods that have been used for centuries to support women's health. However, if you have any specific health conditions or allergies, we recommend consulting with your healthcare provider before starting."
  },
  {
    question: "When will I see results?",
    answer: "Most women start noticing improvements within 2-3 months of consistent use. However, results can vary from person to person. Some may experience benefits like reduced PMS symptoms, better sleep, and improved skin within the first month, while hormonal balance improvements typically take 2-3 cycles to become noticeable. Consistency is key - take your laddus daily as recommended for best results."
  },
  {
    question: "Can I take this with irregular periods?",
    answer: "Yes, seed cycling can actually help regulate irregular periods. Our laddus are specifically designed to support hormonal balance, which can help normalize your cycle over time. Many women with irregular periods have found seed cycling beneficial. We recommend tracking your cycle and following the Phase 1 and Phase 2 schedule based on your last period date. If your periods are very irregular or you haven't had a period in over 3 months, please consult with your healthcare provider."
  },
  {
    question: "Is this suitable for PCOS?",
    answer: "Yes, our seed cycling laddus are suitable and beneficial for women with PCOS/PCOD. The natural seeds in our laddus help support hormonal balance, which is particularly important for PCOS management. The flaxseeds and pumpkin seeds in Phase 1 support estrogen balance, while sesame and sunflower seeds in Phase 2 help with progesterone production. Many women with PCOS have reported improvements in their symptoms, cycle regularity, and overall well-being. However, we recommend discussing with your healthcare provider as part of your overall PCOS management plan."
  }
];

export function FAQSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about seed cycling laddus
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-wellness-cream/50 rounded-2xl px-6 border-none shadow-soft"
              >
                <AccordionTrigger className="text-left font-heading text-lg font-semibold text-foreground hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}


