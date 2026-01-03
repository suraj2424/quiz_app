// components/HeroSection.tsx
import { 
  Zap, 
  CheckCircle, 
  BookOpen, 
  Lightbulb, 
  Star, 
  TrendingUp,
  BarChart3,
  GraduationCap,
  ArrowRight,
  Play,
  Clock,
  Users,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function HeroSection() {
  const scrollToQuizzes = () => {
    const quizzesSection = document.getElementById('quizzes-section');
    quizzesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/20 to-blue-100/20 rounded-full blur-3xl" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Smart Learning Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Test Your Knowledge
                <span className="block mt-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  With Expert Quizzes
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                Challenge yourself with carefully crafted quizzes. 
                Learn through practice and track your progress with detailed insights.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToQuizzes}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/30 hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span>Browse Categories</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-8 pt-8">
              {[
                { icon: Users, value: '10K+', label: 'Active Learners' },
                { icon: Award, value: '500+', label: 'Expert Quizzes' },
                { icon: TrendingUp, value: '95%', label: 'Success Rate' },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
                    <stat.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Premium Quiz Preview */}
          <div className="relative lg:pl-8">
            {/* Main Quiz Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100/80 p-6 lg:p-8 relative z-10">
              <div className="space-y-6">
                {/* Quiz Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <Lightbulb className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">JavaScript Fundamentals</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                          <BookOpen className="w-4 h-4" />
                          15 questions
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          20 min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-sm font-medium rounded-full border border-green-100">
                    Beginner
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {/* Question Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">
                      Question 8
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-medium text-gray-900 leading-relaxed">
                    What is the correct way to declare a variable in JavaScript?
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      { text: 'let variableName;', selected: false },
                      { text: 'var variableName;', selected: false },
                      { text: 'const variableName;', selected: false },
                      { text: 'All of the above', selected: true }
                    ].map((option, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          option.selected 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 shadow-sm shadow-green-100' 
                            : 'bg-gray-50/80 border-2 border-transparent hover:bg-gray-100/80 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            option.selected 
                              ? 'border-green-500 bg-green-500' 
                              : 'border-gray-300 bg-white'
                          }`}>
                            {option.selected && (
                              <CheckCircle className="w-4 h-4 text-white" fill="currentColor" />
                            )}
                          </div>
                          <span className={`font-medium ${option.selected ? 'text-green-700' : 'text-gray-700'}`}>
                            {option.text}
                          </span>
                          {option.selected && (
                            <div className="ml-auto">
                              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-md">
                                Correct!
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Floating Achievement Badge */}
            <div className="absolute -top-6 -right-4 lg:-right-8 z-20">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex flex-col items-center justify-center shadow-xl shadow-orange-500/30 rotate-12 hover:rotate-0 transition-transform duration-300">
                <Star className="w-8 h-8 text-white" fill="currentColor" />
                <span className="text-xs font-bold text-white mt-0.5">TOP</span>
              </div>
            </div>

            

            {/* Decorative Elements */}
            <div className="absolute top-1/4 -right-12 w-24 h-24 bg-purple-100/50 rounded-full blur-2xl" />
            <div className="absolute bottom-1/4 -left-12 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}