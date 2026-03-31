import { Rocket, Brain, BarChart3 } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Interactive Learning",
    description:
      "Engage with dynamic quizzes designed to make learning enjoyable. Get instant feedback and learn from your mistakes.",
    stats: "98% engagement rate",
    color: "bg-teal-400",
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Adaptive Difficulty",
    description:
      "Our smart algorithm adjusts question difficulty based on your performance, ensuring optimal learning progression.",
    stats: "Personalized for you",
    color: "bg-amber-400",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with detailed analytics, performance insights, and achievement tracking.",
    stats: "Real-time analytics",
    color: "bg-purple-400",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#0D0221] border-t-[4px] border-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-20 space-y-4">
          <div className="inline-block bg-black text-white px-4 py-1 font-black uppercase italic text-xs border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(20,184,166,1)]">
            WHY CHOOSE US
          </div>
          <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-black dark:text-white">
            LEARN <span className="text-rose-500 italic">SMARTER</span>,<br />
            NOT HARDER
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
        {/* Bottom CTA: The "Power Box" */}
        <div className="mt-24 relative">
          {/* FIX: Shadow layer now becomes Teal in dark mode to stay visible */}
          <div className="absolute inset-0 bg-black dark:bg-teal-500/20 translate-x-3 translate-y-3" />

          {/* FIX: Container gets a slightly different dark bg to pop from the section bg */}
          <div className="relative bg-teal-500 dark:bg-[#1a1a2e] border-[4px] border-black p-10 lg:p-16 text-center transition-colors">
            {/* FIX: Text color must swap to white in dark mode */}
            <h3 className="text-4xl lg:text-5xl font-black text-black dark:text-white uppercase italic mb-6">
              Ready to Transform Your Learning?
            </h3>

            <p className="text-xl font-bold text-black/80 dark:text-gray-400 mb-10 max-w-2xl mx-auto uppercase tracking-tight">
              Join thousands of learners who have already improved their skills
              with our raw, no-nonsense platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {/* Primary Button: Becomes Teal with White text in dark mode */}
              <button className="px-10 py-5 bg-black dark:bg-teal-500 text-white dark:text-black font-black uppercase italic text-lg border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Start Learning Today
              </button>

              {/* Secondary Button: Becomes Black with White text in dark mode */}
              <button className="px-10 py-5 bg-white dark:bg-black text-black dark:text-white font-black uppercase text-lg border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(20,184,166,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                View All Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
