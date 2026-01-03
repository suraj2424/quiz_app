// dashboard2/types.ts - Shared TypeScript types

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface UserData {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface LayoutConfig {
  sidebarWidth: {
    expanded: number;
    collapsed: number;
  };
  headerHeight: number;
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

// Dashboard data types (from original dashboard)
export interface Quiz {
  difficulty: "easy" | "medium" | "hard";
  id: string;
  title: string;
  description: string;
  questions: number;
  duration: number;
}

export interface Attempt {
  attemptId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  startTime: string;
  endTime: string;
  completed: boolean;
  totalScore: number;
  percentage: number;
}

export interface QuizAttempts {
  quizId: string;
  quizTitle: string;
  attempts: Attempt[];
  stats: {
    totalAttempts: number;
    highestScore: number;
    averageScore: number;
    totalTimeSpent: number;
  };
}

export interface AnalyticsData {
  averageScore: number;
  totalTimeSpent: number;
  totalAttempts: number;
  completionRate: number;
  scoresTrend?: number;
  attemptsTrend?: number;
  timeTrend?: number;
  completionTrend?: number;
}
