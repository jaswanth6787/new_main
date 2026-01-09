import { Card, CardContent } from "@/components/ui/card";

const timelineData = [
    {
        day: "Day 1",
        label: "Start Phase 1",
        subtext: "Menstruation Begins",
        detail: "Estrogen Rising",
        extra: "Flax & Pumpkin"
    },
    {
        day: "Day 7",
        label: "Follicular Phase",
        subtext: "Energy Rising",
        detail: "Estrogen Building",
        extra: "Flax & Pumpkin"
    },
    {
        day: "Day 14",
        label: "Ovulation",
        subtext: "Peak Energy",
        detail: "Estrogen Peak",
        extra: "Switch Phase"
    },
    {
        day: "Day 15",
        label: "Start Phase 2",
        subtext: "Luteal Phase",
        detail: "Progesterone Rising",
        extra: "Sesame & Sunflower"
    },
    {
        day: "Day 21",
        label: "Mid-Luteal",
        subtext: "Winding Down",
        detail: "Progesterone Peak",
        extra: "Sesame & Sunflower"
    },
    {
        day: "Day 28",
        label: "Cycle End",
        subtext: "PMS Care",
        detail: "Hormones Drop",
        extra: "Prepare for Period"
    }
];

export const CycleTimeline = () => {
    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                        How to Take Your Laddus
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Simple daily routine for maximum hormone balancing benefits
                    </p>
                </div>

                <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="p-0">
                        {/* Header Icons */}
                        <div className="flex justify-between items-center mb-12 px-4 md:px-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    {/* Custom Laddu Icon - Pyramid of 3 */}
                                    <div className="relative w-24 h-24">
                                        {/* Top Laddu */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#FDE047] shadow-lg flex items-center justify-center overflow-hidden">
                                            <div className="w-1 h-1 bg-red-400 rounded-full absolute top-3 left-4"></div>
                                            <div className="w-1 h-1 bg-green-400 rounded-full absolute top-5 left-7"></div>
                                            <div className="w-1 h-1 bg-orange-400 rounded-full absolute bottom-3 left-5"></div>
                                        </div>
                                        {/* Bottom Left Laddu */}
                                        <div className="absolute bottom-0 left-0 w-12 h-12 rounded-full bg-[#FDE047] shadow-lg flex items-center justify-center overflow-hidden">
                                            <div className="w-1 h-1 bg-red-400 rounded-full absolute top-4 left-3"></div>
                                            <div className="w-1 h-1 bg-green-400 rounded-full absolute top-2 left-6"></div>
                                        </div>
                                        {/* Bottom Right Laddu */}
                                        <div className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-[#FDE047] shadow-lg flex items-center justify-center overflow-hidden">
                                            <div className="w-1 h-1 bg-red-400 rounded-full absolute top-3 left-5"></div>
                                            <div className="w-1 h-1 bg-green-400 rounded-full absolute bottom-4 left-3"></div>
                                        </div>
                                        {/* Leaves */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-500">
                                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="text-2xl font-light text-gray-400 tracking-widest lowercase block mb-1">morning</span>
                                    <p className="text-sm font-medium text-wellness-green">Days 1-14: Phase I Laddu</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    {/* Custom Moon Icon */}
                                    <div className="relative w-24 h-24 rounded-full bg-[#FEF08A] shadow-lg overflow-hidden">
                                        <div className="absolute top-0 right-0 w-12 h-24 bg-[#FDE047] rounded-r-full opacity-80"></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="text-2xl font-light text-gray-400 tracking-widest block mb-1">Morning</span>
                                    <p className="text-sm font-medium text-wellness-pink">Days 15-28: Phase II Laddu</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative mt-20 px-4">
                            {/* Horizontal Line */}
                            <div className="absolute top-0 left-0 w-full h-px bg-gray-200"></div>

                            {/* Data Points */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pt-8">
                                {timelineData.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center text-center group cursor-pointer relative">
                                        {/* Timeline Node */}
                                        <div className="absolute -top-[37px] w-4 h-4 rounded-full bg-white border-4 border-gray-200 group-hover:border-yellow-400 group-hover:scale-125 transition-all duration-300 z-10"></div>

                                        {/* Content */}
                                        <div className="mt-4 space-y-1 transition-all duration-300 group-hover:-translate-y-1">
                                            <span className="text-gray-400 font-medium mb-2 block text-lg">{item.day}</span>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-gray-600">{item.label}</p>
                                                <p className="text-xs text-gray-400">{item.subtext}</p>
                                                <p className="text-xs text-gray-400">{item.detail}</p>
                                                <p className="text-xs font-medium text-primary/80">{item.extra}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};
