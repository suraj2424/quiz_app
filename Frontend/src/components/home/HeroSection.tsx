// components/HeroSection.tsx
export default function HeroSection() {
  const scrollToQuizzes = () => {
    const quizzesSection = document.getElementById('quizzes-section');
    quizzesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-50 to-white relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(168,85,247,0.02)_25%,rgba(168,85,247,0.02)_50%,transparent_50%,transparent_75%,rgba(168,85,247,0.02)_75%)] bg-[length:60px_60px]" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Test Your Knowledge
                <span className="block text-purple-600">With Expert Quizzes</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Challenge yourself with carefully crafted quizzes. 
                Learn through practice and track your progress.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToQuizzes}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-purple-600/25"
              >
                Explore Quizzes
              </button>
              
              <button className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-colors duration-200">
                Watch Demo
              </button>
            </div>

            {/* Quiz Types */}
            <div className="flex gap-8 pt-8 border-t border-gray-200">
              {[
                { icon: '⚡', label: 'Quick Quiz', sublabel: '5 min tests' },
                { icon: '✓', label: 'Practice Tests', sublabel: 'Exam prep' },
                { icon: '📚', label: 'Study Mode', sublabel: 'Learn & review' }
              ].map((type, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">{type.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{type.label}</div>
                  <div className="text-xs text-gray-600">{type.sublabel}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Quiz Preview */}
          <div className="relative">
            {/* Main Quiz Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative z-10">
              <div className="space-y-6">
                {/* Quiz Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">JavaScript Fundamentals</h3>
                      <p className="text-sm text-gray-500">15 questions • 20 min</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    Beginner
                  </div>
                </div>

                {/* Question Preview */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    What is the correct way to declare a variable in JavaScript?
                  </h4>
                  
                  <div className="space-y-3">
                    {['let variableName;', 'var variableName;', 'const variableName;', 'All of the above'].map((option, index) => (
                      <div 
                        key={index} 
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          index === 3 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            index === 3 
                              ? 'border-green-500 bg-green-500' 
                              : 'border-gray-300'
                          }`}>
                            {index === 3 && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className={index === 3 ? 'text-green-700 font-medium' : 'text-gray-700'}>
                            {option}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-medium">8/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '53%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg rotate-12">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>

            <div className="absolute -bottom-4 -left-4 w-20 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg -rotate-6">
              <span className="text-white font-bold text-sm">98%</span>
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Instant Feedback',
              description: 'Get immediate explanations and learn from mistakes in real-time.'
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: 'Progress Tracking',
              description: 'Monitor your improvement with detailed analytics and insights.'
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
              title: 'Expert Content',
              description: 'Access curated quizzes created by subject matter experts.'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}