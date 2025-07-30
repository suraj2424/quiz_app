import { useEffect, useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import { TbCircleHalf2 } from "react-icons/tb";
import { ImExit } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import TimerAnimation from "./TimerAnimation";
import { VscBook } from "react-icons/vsc";
import { CiClock1 } from "react-icons/ci";
import { IoBarChartOutline } from "react-icons/io5";
import WatermarkBackground from "./WatermarkBackground";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";

interface Option {
  optionText: string;
  isCorrect: boolean;
  hidden?: boolean;
}

interface Question {
  questionType: "Multiple Choice" | "True/False" | "Short Answer";
  questionText: string;
  options: Option[];
  hint?: string;
  answerExplanation: string;
  points: number;
  _id: string;
  correctAnswer: number;
}

interface Quiz {
  title: string;
  description: string;
  noOfQuestions: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  tags: string[];
  category: string;
  questions: Question[];
  status: "Draft" | "Published" | "Archived";
  totalScore: number;
}

interface AnsweredQuestion {
  questionIndex: number;
  answerIndex: number | string;
  selectedAnswer?: number | string;
  isCorrect?: boolean;
  points?: number;
  question?: Question;
}

interface User {
  user: {
    name: string;
    id: string;
    email: string;
  };
}

export default function Quiz() {
  const { id } = useParams();
  const quizId = id?.split("=")[1];
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(
    null
  );
  const [answeredQuestions, setAnsweredQuestions] = useState<
    AnsweredQuestion[]
  >([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hintClicked, setHintClicked] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [shortAnswer, setShortAnswer] = useState("");

  const [startTime, setStartTime] = useState<Date>(new Date());

  const [user, setUser] = useState<User | null>(null);
  const cookies = new Cookies();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = cookies.get("token");
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
      }
    };

    verifyToken();
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

      try {
        const response = await fetch(
          `${backendUrl}/api/quiz/${quizId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data = await response.json();
        const modifiedData = {
          ...data,
          timeLimit: data.timeLimit * 60,
        };
        setQuiz(modifiedData);
        console.log(modifiedData);
        // make time * 60
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (quiz?.randomizeQuestions) {
      setQuiz((prevQuiz) =>
        prevQuiz
          ? {
              ...prevQuiz,
              questions: [...prevQuiz.questions].sort(
                () => Math.random() - 0.5
              ),
            }
          : null
      );
    }
  }, [quiz?.randomizeQuestions]);

  useEffect(() => {
    let timer: number | null = null;
    const startTime = new Date(); // Track actual start time

    if (quizStarted && quiz && timeElapsed < quiz.timeLimit) {
      timer = setInterval(() => {
        const currentTime = new Date();
        const actualTimeElapsed = Math.floor(
          (currentTime.getTime() - startTime.getTime()) / 1000
        );

        setTimeElapsed(() => {
          if (actualTimeElapsed >= quiz.timeLimit) {
            if (timer) clearInterval(timer);
            setShowScore(true);
            setQuizStarted(false);
            return quiz.timeLimit;
          }
          return actualTimeElapsed;
        });
      }, 1000);
    }

    // Cleanup
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizStarted, quiz]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHintClicked(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, [hintClicked]);

  if (loading) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="w-screen h-screen grid place-items-center text-red-600">
        {error || "Quiz not found"}
      </div>
    );
  }

  const calculateLevenshteinRatio = (a: string, b: string): number => {
    const matrix = Array(b.length + 1)
      .fill(null)
      .map(() => Array(a.length + 1).fill(null));

    // Initialize first row and column
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    // Fill matrix
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + substitutionCost
        );
      }
    }

    const distance = matrix[b.length][a.length];
    const maxLength = Math.max(a.length, b.length);
    return 1 - distance / maxLength;
  };

  const checkAnswer = (
    question: Question,
    userAnswer: number | string
  ): { isCorrect: boolean; points: number } => {
    try {
      // Handle short answer questions
      if (question.questionType === "Short Answer") {
        const correctAnswer = question.options[0].optionText;
        const userText = String(userAnswer).trim();
        const similarity = calculateLevenshteinRatio(
          userText.toLowerCase(),
          correctAnswer.toLowerCase()
        );
        const isCorrect = similarity >= 0.85;
        const points = isCorrect
          ? question.points
          : Math.floor(question.points * similarity);

        return { isCorrect, points };
      }

      // Handle multiple choice questions
      if (question.questionType === "Multiple Choice" || question.questionType === "True/False") {
        const selectedOption = question.options[Number(userAnswer)];
        const isCorrect = selectedOption?.isCorrect ?? false;
        const points = isCorrect ? question.points : 0;

        return { isCorrect, points };
      }

      return { isCorrect: false, points: 0 };
    } catch (error) {
      console.error("Error checking answer:", error);
      return { isCorrect: false, points: 0 };
    }
  };

  const submitQuiz = async () => {
    try {
      const token = cookies.get("token");
      if (!token || !user?.user.id || !quizId) {
        toast.error("Authentication required");
        return;
      }

      const endTime = new Date();
      const timeSpentInSeconds = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000
      );

      // Get current question answer if it's not in answeredQuestions
      let finalAnswers = [...answeredQuestions];
      const currentQuestionData = quiz.questions[currentQuestion];
      const currentAnswer = finalAnswers.find(
        (q) => q.questionIndex === currentQuestion
      );

      // If current question isn't answered yet, process it
      if (!currentAnswer && (selectedAnswer !== null || shortAnswer.trim())) {
        const answer =
          currentQuestionData.questionType === "Short Answer"
            ? shortAnswer
            : (selectedAnswer as number);
        
        const result = checkAnswer(currentQuestionData, answer);
        
        const newAnswer = {
          questionIndex: currentQuestion,
          answerIndex: answer,
          selectedAnswer: answer,
          isCorrect: result.isCorrect,
          points: result.points,
          questionId: currentQuestionData._id // Include question ID
        };

        finalAnswers = [...finalAnswers, newAnswer];
      }

      // Validate all questions are answered
      if (finalAnswers.length !== quiz.questions.length) {
        toast.warning("Please answer all questions before submitting");
        return;
      }

      // Format answers for backend
      const formattedAnswers = finalAnswers.map(answer => ({
        questionId: answer.question?._id || quiz.questions[answer.questionIndex]._id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: answer.isCorrect,
        points: answer.points
      }));

      // Calculate final score
      const finalScore = finalAnswers.reduce(
        (total, answer) => total + (answer.points || 0),
        0
      );

      // Construct attempt data matching backend schema
      const attemptData = {
        quiz: quizId,
        user: user.user.id, // This will be overwritten by backend
        answers: formattedAnswers,
        score: finalScore,
        totalQuestions: quiz.questions.length,
        timeSpent: timeSpentInSeconds,
        completed: true,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalScore: quiz.totalScore
      };

      console.log('Submitting attempt data:', attemptData); // Debug log

      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";


      const response = await fetch(`${backendUrl}/api/attempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(attemptData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Server response:', responseData); // Debug log
        throw new Error(responseData.error || 'Failed to save attempt');
      }

      // Update state after successful submission
      setScore(finalScore);
      setAnsweredQuestions(finalAnswers);
      setShowScore(true);
      setQuizStarted(false);
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error saving attempt:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit quiz"
      );
    }
  };

  const handleQuizSubmit = async () => {
    if (!quiz) return;

    const currentQuestionData = quiz.questions[currentQuestion];
    
    // Check if current question is answered
    const isCurrentQuestionAnswered = 
      currentQuestionData.questionType === "Short Answer"
        ? shortAnswer.trim() !== ""
        : selectedAnswer !== null;

    if (!isCurrentQuestionAnswered) {
      toast.warning("Please answer the current question before submitting");
      return;
    }

    await submitQuiz();
  };

  const handleStartClick = () => {
    setQuizStarted(true);
    setScore(0);
    setStartTime(new Date());
    setTimeElapsed(0);
    setCurrentQuestion(0);
    setAnsweredQuestions([]);
    setShortAnswer("");
  };

  const handlePrevClick = () => {
    setHintClicked(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      // Restore previous short answer if it exists
      const previousAnswer = answeredQuestions.find(
        (q) => q.questionIndex === currentQuestion - 1
      );
      setShortAnswer((previousAnswer?.answerIndex as string) || "");
    }
  };

  const handleNextClick = () => {
    setHintClicked(false);
    const currentQuestionData = quiz.questions[currentQuestion];

    // Validate current answer
    if (currentQuestionData.questionType === "Short Answer") {
      if (!shortAnswer.trim()) {
        toast.warning("Please provide an answer before proceeding");
        return;
      }
    } else if (selectedAnswer === null) {
      toast.warning("Please select an answer before proceeding");
      return;
    }

    // Process current answer
    const answer =
      currentQuestionData.questionType === "Short Answer"
        ? shortAnswer
        : (selectedAnswer as number);
    
    const result = checkAnswer(currentQuestionData, answer);
    
    const newAnswer = {
      questionIndex: currentQuestion,
      answerIndex: answer,
      selectedAnswer: answer,
      isCorrect: result.isCorrect,
      points: result.points,
      question: currentQuestionData
    };

    // Update answers array
    setAnsweredQuestions(prev => {
      const existingIndex = prev.findIndex(
        (q) => q.questionIndex === currentQuestion
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      }
      return [...prev, newAnswer];
    });

    // If it's the last question, submit the quiz
    if (currentQuestion === quiz.questions.length - 1) {
      handleQuizSubmit();
    } else {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
      const nextAnswer = answeredQuestions.find(
        (q) => q.questionIndex === currentQuestion + 1
      );
      setShortAnswer((nextAnswer?.answerIndex as string) || "");
      setSelectedAnswer(null);
    }
  };

  const answerHandler = (index: number) => {
    const currentQuestionData = quiz.questions[currentQuestion];
    if (
      currentQuestionData.questionType !== "Short Answer" &&
      currentQuestionData.options[index].hidden
    )
      return;
    setSelectedAnswer(index);
  };

  const handleExit = () => {
    if (
      window.confirm(
        "Are you sure you want to exit the quiz? Your progress will be lost."
      )
    ) {
      setQuizStarted(false);
      setShowScore(false);
      setTimeElapsed(0);
    }
  };



  const handleHintClick = () => {
    setHintClicked(true);
  };

  const handle5050Click = () => {
    const currentOptions = quiz.questions[currentQuestion].options;
    const correctIndex = currentOptions.findIndex((option) => option.isCorrect);
    const incorrectIndexes = currentOptions
      .map((_, index) => index)
      .filter((index) => index !== correctIndex)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const updatedOptions = currentOptions.map((option, index) => {
      if (incorrectIndexes.includes(index)) {
        return { ...option, hidden: true };
      }
      return option;
    });

    const updatedQuestions = [...quiz.questions];
    updatedQuestions[currentQuestion] = {
      ...updatedQuestions[currentQuestion],
      options: updatedOptions,
    };

    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const InfoCard = ({ icon, label, value, theme }) => {
    const getThemeStyles = (theme) => {
      const baseStyles = "rounded-xl p-4 backdrop-blur-lg transition-all duration-300 hover:shadow-lg";
      switch (theme) {
        case "success":
          return `${baseStyles} bg-green-50/50 text-green-600 hover:bg-green-50/80`;
        case "warning":
          return `${baseStyles} bg-amber-50/50 text-amber-600 hover:bg-amber-50/80`;
        case "danger":
          return `${baseStyles} bg-rose-50/50 text-rose-600 hover:bg-rose-50/80`;
        case "primary":
          return `${baseStyles} bg-indigo-50/50 text-indigo-600 hover:bg-indigo-50/80`;
        case "secondary":
          return `${baseStyles} bg-purple-50/50 text-purple-600 hover:bg-purple-50/80`;
        default:
          return baseStyles;
      }
    };
  
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 }
        }}
        className={getThemeStyles(theme)}
      >
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="text-sm opacity-70">{label}</p>
            <p className="font-semibold">{value}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative">
      {/* Welcome Screen */}
      {quizStarted === false && showScore === false && (
        <motion.div
        className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 
                   flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden"
        key="welcome"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full 
                       mix-blend-multiply filter blur-3xl opacity-30"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-300 rounded-full 
                       mix-blend-multiply filter blur-3xl opacity-20"
          />
        </div>
      
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full backdrop-blur-lg bg-white/80 rounded-2xl shadow-2xl 
                     shadow-purple-500/10 p-6 sm:p-8 md:p-10 space-y-8"
        >
          {/* Header Section */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r 
                              from-purple-600 via-indigo-600 to-pink-600">
                {quiz.title}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {quiz.description}
            </p>
          </motion.div>
      
          {/* Info Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            animate="show"
          >
            <InfoCard
              icon={<IoBarChartOutline className="w-6 h-6" />}
              label="Difficulty"
              value={quiz.difficulty}
              theme={
                quiz.difficulty === "EASY" ? "success" :
                quiz.difficulty === "MEDIUM" ? "warning" : "danger"
              }
            />
      
            <InfoCard
              icon={<CiClock1 className="w-6 h-6" />}
              label="Time Limit"
              value={`${quiz.timeLimit / 60} minutes`}
              theme="primary"
            />
      
            <InfoCard
              icon={<VscBook className="w-6 h-6" />}
              label="Questions"
              value={quiz.noOfQuestions}
              theme="secondary"
            />
          </motion.div>
      
          {/* Start Button */}
          <motion.div 
            className="text-center pt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={handleStartClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center px-8 py-4 
                         text-lg font-medium text-white overflow-hidden rounded-xl
                         bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 
                         shadow-lg shadow-purple-500/25 transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r 
                              from-purple-700 via-indigo-700 to-pink-700 opacity-0 
                              group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                Start Quiz
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </motion.svg>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
      )}

      {/* Quiz Screen */}
      {quizStarted && (
        <div className="w-full h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex-col flex">
          <WatermarkBackground />
          {/* Header */}
          <header className="w-full bg-white/80 backdrop-blur-sm border-b border-purple-100 shadow-lg h-16 fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center h-full px-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {quiz.title}
          </h1>
          <span className={`ml-4 px-3 py-1 rounded-full text-white text-sm ${
            quiz.difficulty === "EASY"
              ? "bg-gradient-to-r from-green-400 to-green-500"
              : quiz.difficulty === "MEDIUM"
              ? "bg-gradient-to-r from-yellow-400 to-orange-400"
              : "bg-gradient-to-r from-red-400 to-red-500"
          }`}>
            {quiz.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <TimerAnimation totalTime={quiz.timeLimit} timeElapsed={timeElapsed} />
          <button onClick={handleExit} className="text-red-500 hover:text-red-600">
            <ImExit className="text-2xl" />
          </button>
        </div>
      </div>
    </header>

    <div className="flex flex-1 pt-16">

    <nav className="w-64 bg-white/80 backdrop-blur-sm border-r border-purple-100 h-[calc(100vh-4rem)] fixed left-0 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-bold text-purple-800 mb-4">Questions</h3>
          <div className="space-y-2">
            {quiz.questions.map((question, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  currentQuestion === index
                    ? "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200"
                    : "hover:bg-gray-50"
                } ${
                  answeredQuestions.find((q) => q.questionIndex === index)
                    ? "border-l-4 border-green-500"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-50 mr-3">
                    {index + 1}
                  </span>
                  <span className="text-sm truncate">
                    {question.questionText.substring(0, 30)}...
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 ml-64 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          {/* Question Content */}
          <section className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-lg p-6 shadow-lg">
              <div className="mb-6 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                <h3 className="text-xl font-bold text-purple-800">
                  Question {currentQuestion + 1}
                  <span className="text-sm text-purple-600 ml-2">
                    of {quiz.questions.length}
                  </span>
                </h3>
                <div className="flex space-x-4">
                  {quiz.questions[currentQuestion].hint && (
                    <button
                      onClick={handleHintClick}
                      className="text-yellow-500 hover:text-yellow-600 transition-all duration-300 transform hover:scale-110"
                      aria-label="Show hint"
                    >
                      <HiOutlineLightBulb className="text-2xl" />
                    </button>
                  )}
                  {quiz.questions[currentQuestion].questionType ===
                    "Multiple Choice" && (
                    <button
                      onClick={handle5050Click}
                      className="text-yellow-500 hover:text-yellow-600 transition-all duration-300 transform hover:scale-110"
                      aria-label="50-50"
                    >
                      <TbCircleHalf2 className="text-2xl" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mb-3">
                Type:
                <span className="font-semibold text-purple-700 ml-2 px-3 py-1 bg-purple-50 rounded-full">
                  {quiz.questions[currentQuestion].questionType} Question
                </span>
              </p>
              <p className="text-lg sm:text-xl mb-6 text-gray-800 font-medium">
                {quiz.questions[currentQuestion].questionText}
              </p>

              <AnimatePresence mode="popLayout">
                {quiz.questions[currentQuestion].questionType !==
                "Short Answer" ? (
                  quiz.questions[currentQuestion].options.map(
                    (option, index) => (
                      <motion.div
                        key={index}
                        className={`mb-3 ${option.hidden ? "hidden" : ""}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button
                          className={`w-full text-left p-4 rounded-lg transition-all duration-300 transform hover:scale-101 ${
                            selectedAnswer === index
                              ? "bg-gradient-to-r from-green-100 border to-green-200 border-green-400 shadow-md"
                              : "bg-white hover:bg-gray-50 border border-purple-100 hover:border-purple-200 shadow-sm"
                          }`}
                          onClick={() => answerHandler(index)}
                          disabled={option.hidden}
                        >
                          <span className="font-bold text-purple-700 mr-3">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option.optionText}
                        </button>
                      </motion.div>
                    )
                  )
                ) : (
                  <div className="w-full space-y-3">
                    <textarea
                      className="w-full p-4 border border-purple-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm bg-white"
                      rows={4}
                      value={shortAnswer}
                      onChange={(e) => setShortAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                    />
                    <p className="text-sm text-gray-500 italic">
                      Note: Your answer will be checked against the correct
                      answer, allowing for minor differences in spelling and
                      formatting.
                    </p>
                  </div>
                )}
              </AnimatePresence>

              {hintClicked && quiz.questions[currentQuestion].hint && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm">
                    <strong className="text-yellow-700">Hint:</strong>
                    <span className="ml-2 text-gray-700">
                      {quiz.questions[currentQuestion].hint}
                    </span>
                  </p>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium shadow-sm disabled:opacity-50"
                  onClick={handlePrevClick}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>
                <button
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium shadow-md"
                  onClick={
                    currentQuestion === quiz.questions.length - 1
                      ? handleQuizSubmit
                      : handleNextClick
                  }
                >
                  {currentQuestion === quiz.questions.length - 1
                    ? "Finish"
                    : "Next"}
                </button>
              </div>
            </section>

          {/* Progress bar at the bottom */}
          <div className="fixed bottom-0 left-64 right-0 h-2 bg-gray-100">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
              style={{
                width: `${(answeredQuestions.length / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </main>
      </div>
      </div>
      )}



      {/* Score Screen */}
      {showScore === true && quizStarted === false && !reviewMode && (
        <motion.div
          key="score"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-screen h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 grid place-items-center p-4"
        >
          <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Quiz Completed!
              </h1>
              <p className="text-gray-600">
                Great effort! Here's how you performed:
              </p>
            </div>

            {/* Score Circle */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-purple-500"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 42}`,
                    strokeDashoffset: `${
                      2 *
                      Math.PI *
                      42 *
                      (1 -
                        score /
                          quiz.questions.reduce(
                            (total, q) => total + q.points,
                            0
                          ))
                    }`,
                    transformOrigin: "50% 50%",
                    transform: "rotate(-90deg)",
                  }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-4xl font-bold text-purple-600">
                  {score}
                </span>
                <span className="text-gray-500 text-lg block">
                  /{quiz.questions.reduce((total, q) => total + q.points, 0)}
                </span>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-sm text-purple-600 font-medium">Accuracy</p>
                <p className="text-2xl font-bold text-purple-700">
                  {Math.round(
                    (score /
                      quiz.questions.reduce(
                        (total, q) => total + q.points,
                        0
                      )) *
                      100
                  )}
                  %
                </p>
              </div>
              <div className="bg-pink-50 rounded-xl p-4 text-center">
                <p className="text-sm text-pink-600 font-medium">Time Taken</p>
                <p className="text-2xl font-bold text-pink-700">
                  {Math.floor(timeElapsed / 60)}:
                  {(timeElapsed % 60).toString().padStart(2, "0")}
                </p>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <p className="text-sm text-indigo-600 font-medium">Questions</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {quiz.questions.length}
                </p>
              </div>
            </div>

            {/* Performance Message */}
            <div className="text-center mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <p className="text-lg text-gray-700">
                {score ===
                quiz.questions.reduce((total, q) => total + q.points, 0)
                  ? "🎉 Perfect Score! Outstanding performance!"
                  : score >=
                    quiz.questions.reduce((total, q) => total + q.points, 0) *
                      0.8
                  ? "🌟 Excellent work! You've got a strong understanding!"
                  : score >=
                    quiz.questions.reduce((total, q) => total + q.points, 0) *
                      0.6
                  ? "👍 Good job! Keep practicing to improve!"
                  : "💪 Keep learning! You'll do better next time!"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartClick}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium shadow-md transform hover:scale-105"
              >
                Try Again
              </button>
              <button
                onClick={() => setReviewMode(true)}
                className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-all duration-300 font-medium shadow-sm transform hover:scale-105"
              >
                Review Answers
              </button>
              <button
                onClick={() => setShowScore(false)}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium shadow-sm transform hover:scale-105"
              >
                Back to Home
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Review Mode */}
      {reviewMode && (
        <motion.div
          key="review"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-screen h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden"
        >
          {/* Header */}
          <div className="h-16 px-8 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-purple-100 shadow-sm">
            <button
              onClick={() => {
                setReviewMode(false);
                setShowScore(true);
              }}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg border-2 border-purple-200 hover:bg-purple-50 transition-all duration-300 font-medium shadow-sm flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Score
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Review Answers
            </h1>
            <div className="w-28"></div>
          </div>

          {/* Main Content */}
          <div className="flex h-[calc(100vh-64px)]">
            {/* Questions Review */}
            <div className="w-3/4 overflow-auto p-4 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
              {quiz.questions.map((question, qIndex) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qIndex * 0.1 }}
                  key={qIndex}
                  className="mb-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-purple-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full font-bold text-sm">
                      {qIndex + 1}
                    </span>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {question.questionText}
                    </h2>
                  </div>

                  <div className="space-y-2 ml-9">
                    {question.questionType !== "Short Answer" ? (
                      question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`px-3 py-2 rounded-lg flex items-center border ${
                            option.isCorrect
                              ? "bg-green-50 border-green-200 text-green-700"
                              : answeredQuestions.find(
                                  (q) => q.questionIndex === qIndex
                                )?.answerIndex === oIndex
                              ? "bg-red-50 border-red-200 text-red-700"
                              : "border-gray-200 hover:bg-gray-50"
                          } transition-colors duration-200`}
                        >
                          <span
                            className={`mr-3 font-semibold px-2 py-0.5 rounded ${
                              option.isCorrect
                                ? "bg-green-100 text-green-700"
                                : answeredQuestions.find(
                                    (q) => q.questionIndex === qIndex
                                  )?.answerIndex === oIndex
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          {option.optionText}
                          {option.isCorrect && (
                            <span className="ml-auto text-green-500">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                        <p className="font-medium text-gray-700">
                          Your answer:{" "}
                          <span className="ml-2 font-normal">
                            {answeredQuestions.find(
                              (q) => q.questionIndex === qIndex
                            )?.answerIndex ?? "Not answered"}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 ml-9 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-sm font-medium ${
                          answeredQuestions.find(
                            (q) => q.questionIndex === qIndex
                          )?.isCorrect
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {answeredQuestions.find(
                          (q) => q.questionIndex === qIndex
                        )?.isCorrect
                          ? "Correct"
                          : "Incorrect"}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        Score:{" "}
                        {answeredQuestions.find(
                          (q) => q.questionIndex === qIndex
                        )?.points || 0}{" "}
                        points
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-800">
                        Explanation:
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {question.answerExplanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Score Summary */}
            <div className="w-1/4 p-4 bg-white/80 backdrop-blur-sm border-l border-purple-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Score Summary
              </h2>

              {/* Circular Score Display */}
              <div className="mb-6">
                <div className="relative w-32 h-32 mx-auto">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      className="text-gray-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className={`${
                        score ===
                        quiz.questions.reduce((total, q) => total + q.points, 0)
                          ? "text-green-500"
                          : "text-purple-500"
                      }`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 42}`,
                        strokeDashoffset: `${
                          2 *
                          Math.PI *
                          42 *
                          (1 -
                            score /
                              quiz.questions.reduce(
                                (total, q) => total + q.points,
                                0
                              ))
                        }`,
                      }}
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {score}
                    </span>
                    <span className="text-gray-500 text-xs block">
                      /
                      {quiz.questions.reduce((total, q) => total + q.points, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="space-y-3">
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-600 mb-1">
                    Total Questions
                  </p>
                  <p className="text-xl font-bold text-purple-700">
                    {quiz.questions.length}
                  </p>
                </div>

                <div className="w-full flex">
                  <div className="bg-green-50 rounded-lg p-3 w-1/2">
                    <p className="text-xs text-green-600 mb-1">
                      Correct Answers
                    </p>
                    <p className="text-xl font-bold text-green-700">{score}</p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-3 w-1/2">
                    <p className="text-xs text-red-600 mb-1">
                      Incorrect Answers
                    </p>
                    <p className="text-xl font-bold text-red-700">
                      {quiz.questions.length - score}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 mb-1">Accuracy</p>
                  <p className="text-xl font-bold text-blue-700">
                    {Math.round((score / quiz.questions.length) * 100)}%
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => {
                    setReviewMode(false);
                    setShowScore(false);
                    setQuizStarted(true);
                    // answeredQuestions = [];
                    setCurrentQuestion(0);
                    setScore(0);
                    setTimeElapsed(0);
                    setAnsweredQuestions([]);
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium shadow-md"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setReviewMode(false);
                    setShowScore(false);
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
