import QuizHeader from '../components/QuizHeader';
import QuizNavigation from '../components/QuizNavigation';
import QuizContent from '../components/QuizContent';
import { Question } from '../types';

interface QuizSessionProps {
  questions: Question[];
  title?: string;
  timeLimit?: number;
}

export default function QuizSession({ questions, title = 'Quiz', timeLimit = 600 }: QuizSessionProps) {
  return (
    <div className="min-h-screen bg-white font-mono flex flex-col">
      {/* Header stays fixed at the top */}
      <QuizHeader title={title} timeLimit={timeLimit} />

      <div className="flex flex-1 pt-20"> {/* pt-20 matches header height */}
        {/* Sidebar: Navigation Grid */}
        <aside className="hidden lg:block w-80 fixed left-0 top-20 bottom-0 border-r-4 border-black bg-white overflow-y-auto">
          <QuizNavigation questions={questions} />
        </aside>

        {/* Main: Question Content */}
        <main className="flex-1 lg:ml-80 bg-teal-50/20 p-6 lg:p-12 min-h-[calc(100vh-5rem)]">
          <div className="max-w-3xl mx-auto">
            <QuizContent questions={questions} />
          </div>
        </main>
      </div>
    </div>
  );
}
