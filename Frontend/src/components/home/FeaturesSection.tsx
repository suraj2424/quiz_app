// components/FeaturesSection.tsx
import FeatureCard from "./FeatureCard";
import SectionHeader from "./SectionHeader";

const features = [
  {
    icon: "rocket",
    title: "Interactive Learning",
    description: "Engage with dynamic quizzes designed to make learning enjoyable and effective. Get instant feedback and learn from your mistakes.",
    stats: "98% engagement rate"
  },
  {
    icon: "brain",
    title: "Adaptive Difficulty",
    description: "Our smart algorithm adjusts question difficulty based on your performance, ensuring optimal learning progression.",
    stats: "Personalized for you"
  },
  {
    icon: "chart",
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics, performance insights, and achievement tracking.",
    stats: "Real-time analytics"
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          badge="WHY CHOOSE US"
          title="Learn Smarter, Not Harder"
          description="Discover the features that make our platform the preferred choice for thousands of learners worldwide."
        />

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              feature={feature} 
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Learning?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who have already improved their knowledge and skills with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200">
                Start Learning Today
              </button>
              <button className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors duration-200">
                View All Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}