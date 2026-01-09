import { useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/Button";

export const AISearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const simulatedResponses: Record<string, string> = {
    "seed cycling": "Seed cycling is a natural approach to hormonal balance using specific seeds during different phases of your menstrual cycle. During days 1-14 (follicular phase), flax and pumpkin seeds support estrogen production. During days 15-28 (luteal phase), sesame and sunflower seeds support progesterone.",
    "phase 1": "Phase I Laddu is for days 1-14 of your cycle. It contains flaxseeds and pumpkin seeds that support healthy estrogen production, promote regular ovulation, and are rich in omega-3 fatty acids and natural lignans.",
    "phase 2": "Phase II Laddu is for days 15-28 of your cycle. It contains sesame and sunflower seeds that support healthy progesterone levels, reduce PMS symptoms, and are rich in vitamin E and magnesium.",
    "benefits": "Our laddus help balance hormones naturally, reduce PMS symptoms, support regular cycles, improve fertility, boost energy levels, and promote glowing skin - all through the power of seed cycling!",
    "ingredients": "Phase I contains flaxseeds and pumpkin seeds. Phase II contains sesame seeds and sunflower seeds. All our ingredients are organic, nutrient-dense, and carefully selected for maximum hormonal benefits.",
    "how to take": "Take one Phase I Laddu daily during days 1-14 of your cycle (from the first day of your period). Then switch to Phase II Laddu for days 15-28. It's that simple!",
  };

  const getAIResponse = (userQuery: string) => {
    const lowerQuery = userQuery.toLowerCase();

    for (const [key, value] of Object.entries(simulatedResponses)) {
      if (lowerQuery.includes(key)) {
        return value;
      }
    }

    return "I'm here to help you learn about seed cycling and our laddus! Try asking about 'seed cycling', 'phase 1', 'phase 2', 'benefits', 'ingredients', or 'how to take'.";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse("");

    // Simulate AI processing
    setTimeout(() => {
      setResponse(getAIResponse(query));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full p-2 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center gap-2"
          aria-label="Open AI Search"
        >
          <Sparkles className="h-4 w-4 md:h-6 md:w-6" />
          <span className="font-medium pr-2 text-sm md:text-base">Ask AI</span>
        </button>
      )}

      {/* AI Search Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-96 bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
              <h3 className="font-semibold text-primary-foreground">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              aria-label="Close AI Search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about seed cycling, laddus..."
                  className="w-full px-4 py-2 pr-12 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}

            {response && (
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="leading-relaxed">{response}</p>
                </div>
              </div>
            )}

            {!response && !isLoading && (
              <div className="text-muted-foreground text-sm">
                <p className="mb-2">Try asking:</p>
                <ul className="space-y-1 text-xs">
                  <li>• What is seed cycling?</li>
                  <li>• Tell me about Phase 1</li>
                  <li>• What are the benefits?</li>
                  <li>• How do I take these?</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
