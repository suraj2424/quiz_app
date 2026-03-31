// components/HeroSection.tsx
import { 
  Play, 
  ArrowRight, 
  BookOpen,
  Lightbulb, 
  Clock, 
  CheckCircle,
  Star,
  Sparkles
} from 'lucide-react';

export default function HeroSection() {
  const scrollToQuizzes = () => {
    const quizzesSection = document.getElementById('quizzes-section');
    quizzesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] bg-white dark:bg-[#0D0221] overflow-hidden transition-colors">
      {/* Neo-Brutalist Background: Grid instead of Blurs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      
      {/* Decorative Floating Shape */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-400 border-[4px] border-black rotate-12 hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge: Solid & Boxy */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-4 h-4 text-black" />
              <span className="text-sm font-black uppercase italic text-black tracking-tight">
                Smart Learning Platform
              </span>
            </div>

            {/* Main Heading: Lexend & Chunky */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-black dark:text-white uppercase leading-[0.9] tracking-tighter">
                Test Your <br />
                <span className="bg-teal-500 text-white px-2 italic border-y-[6px] border-black dark:border-white inline-block mt-2">
                  Knowledge
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-800 dark:text-gray-300 font-bold leading-tight max-w-xl">
                Challenge yourself with expert-crafted quizzes. 
                Learn through practice and crush your goals with real-time insights.
              </p>
            </div>

            {/* CTA Buttons: Tactile Shadow Effect */}
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={scrollToQuizzes}
                className="neo-btn bg-teal-500 text-lg py-5"
              >
                <Play className="w-6 h-6" fill="currentColor" />
                <span>Start Learning</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              
              <button className="neo-btn bg-white dark:bg-slate-800 text-black dark:text-white text-lg py-5">
                <BookOpen className="w-6 h-6 text-rose-500" />
                <span>Categories</span>
              </button>
            </div>
          </div>

          {/* Right Content - The "Playbook" Card */}
          <div className="relative lg:pl-8">
            <div className="neo-card p-0 overflow-hidden bg-white dark:bg-slate-900 rotate-2 hover:rotate-0">
              {/* Card Header */}
              <div className="bg-rose-500 p-6 border-b-[3px] border-black dark:border-white flex items-center gap-4">
                <div className="w-16 h-16 bg-white border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Lightbulb className="w-8 h-8 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-black text-white text-xl uppercase tracking-tighter">JS Fundamentals</h3>
                  <div className="flex gap-4 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-black text-rose-100 uppercase">
                      <Clock className="w-3 h-3" /> 20 MIN
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-black text-rose-100 uppercase">
                      <BookOpen className="w-3 h-3" /> 15 Q's
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-6">
                <h4 className="text-xl font-black text-black dark:text-white uppercase leading-tight italic">
                  "What is the correct way to declare a variable?"
                </h4>
                
                <div className="space-y-3">
                  {[
                    { text: 'let variableName;', selected: false },
                    { text: 'All of the above', selected: true }
                  ].map((option, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border-[3px] border-black flex items-center gap-4 transition-all ${
                        option.selected 
                          ? 'bg-teal-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                          : 'bg-gray-100 dark:bg-slate-800 dark:text-white'
                      }`}
                    >
                      <div className={`w-6 h-6 border-[2px] border-black ${option.selected ? 'bg-white text-teal-500' : 'bg-white'} flex items-center justify-center`}>
                        {option.selected && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <span className="font-black uppercase text-sm italic">{option.text}</span>
                      {option.selected && <span className="ml-auto text-[10px] font-black underline uppercase">Correct</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievement Badge - Floating */}
            <div className="absolute -top-8 -right-4 z-20">
              <div className="w-24 h-24 bg-amber-400 border-[4px] border-black flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-12 hover:rotate-0 transition-transform">
                <Star className="w-10 h-10 text-black" fill="currentColor" />
                <span className="text-[10px] font-black text-black mt-1 uppercase tracking-widest">TOP TIER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}