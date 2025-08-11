// components/QuizzesSection.tsx
import { useState, useMemo } from "react";
import QuizCard from "../QuizCard/QuizCard";

interface Quiz {
  _id: string;
  id: number;
  title: string;
  tags: string[];
  difficulty: string;
  questionCount: number;
  questions: {
    id: number;
    question: string;
    options: string[];
    answer: string;
  }[];
  createdBy: {
    name?: string;
  };
}

interface QuizzesSectionProps {
  quizzes: Quiz[];
  isLoading?: boolean;
  error?: string | null;
}

export default function QuizzesSection({ quizzes, isLoading, error }: QuizzesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories from quiz tags
  const categories = useMemo(() => {
    const allTags = quizzes.flatMap(quiz => quiz.tags);
    return [...new Set(allTags)];
  }, [quizzes]);

  // Filter quizzes based on search and filters
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quiz.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === "all" || quiz.tags.includes(selectedCategory);
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [quizzes, searchTerm, selectedDifficulty, selectedCategory]);

  const difficulties = ["all", "beginner", "intermediate", "advanced"];

  if (error) {
    return (
      <section id="quizzes-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load quizzes</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quizzes-section" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Quiz Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from hundreds of expertly crafted quizzes across various subjects and difficulty levels.
            Test your knowledge and track your progress.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
          <div className="grid md:grid-cols-4 gap-4">
            
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Quizzes
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by title or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "All Levels" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {isLoading ? (
                "Loading quizzes..."
              ) : (
                `Showing ${filteredQuizzes.length} of ${quizzes.length} quizzes`
              )}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quiz Grid */}
        {!isLoading && (
          <>
            {filteredQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <QuizCard key={quiz._id} quiz={quiz} />
                ))}
              </div>
            ) : (
              /* Empty State */
              /* Loading State */
<div className="text-center py-16" role="status" aria-live="polite">
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
    {/* Spinner */}
    <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto mb-4" />
    
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading quizzes...</h3>
    <p className="text-gray-600">
      Fetching the latest quizzes. Please wait.
    </p>
  </div>
</div>
            )}
          </>
        )}

        {/* Browse All Link */}
        {!isLoading && filteredQuizzes.length > 0 && filteredQuizzes.length < quizzes.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDifficulty("all");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold rounded-lg transition-colors duration-200"
            >
              View All Quizzes
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}