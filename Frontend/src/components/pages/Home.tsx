import { useState, useEffect, useContext, useRef } from "react";
import QuizCard from "../QuizCard";
import { Link } from "react-router-dom";
import { FaUserLarge } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import { TokenContext } from "../../contexts/TokenContextProvider";
import { IoAdd } from "react-icons/io5";
import { IoChevronDown } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaRocket, FaBrain, FaChartLine } from "react-icons/fa";
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

interface UserData {
  name: string;
  email: string;
  id: string;
  type: string;
}

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userToggle, setUserToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const quizzesRef = useRef<HTMLDivElement>(null);

  const { token, removeToken } = useContext(TokenContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const fadeInUpTransition = {
    duration: 0.6,
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/quiz", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          const dummyQuizzes = data.map((quiz: Quiz) => ({
            _id: quiz._id,
            id: quiz.id,
            title: quiz.title,
            difficulty: quiz.difficulty,
            tags: quiz.tags,
            questionCount: quiz.questions.length,
            questions: quiz.questions,
            createdBy: { name: quiz.createdBy?.name },
          }));
          setQuizzes(dummyQuizzes);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/verify-token",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUserData(data.user);
          } else {
            setUserData(null);
            removeToken();
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          setUserData(null);
        }
      }
    };

    fetchQuizzes();
    verifyToken();
  }, [token, removeToken]);

  const handleLogOut = () => {
    setUserToggle(false);
    setIsLoading(true);
    removeToken();
    setUserData(null);
    window.location.reload();
  };

  const showQuizzes = () => {
    quizzesRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="progress-3"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-cyan-600 selection:text-white">
      <header className="h-16 px-10 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold  font-openSans ">Quizin'</h1>
          <nav className="relative">
            {userData ? (
              <div className="flex items-center gap-6">
                {userData.type === "teacher" && (
                  <Link
                    to="/create-quiz"
                    className="flex items-center gap-2 px-4 py-2 rounded-full 
                     bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                     hover:from-indigo-600 hover:to-purple-600 
                     transition-all duration-200 shadow-md shadow-purple-500/20"
                  >
                    <IoAdd className="w-5 h-5" />
                    <span>Create Quiz</span>
                  </Link>
                )}

                <div className="relative">
                  <motion.button
                    onClick={() => setUserToggle(!userToggle)}
                    className="flex items-center gap-3 px-4 py-2 rounded-full
                     hover:bg-gray-100 transition-all duration-200"
                  >
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 
                          flex items-center justify-center text-white font-medium"
                    >
                      {userData.name[0].toUpperCase()}
                    </div>
                    <span className="text-gray-700">{userData.name}</span>
                    <motion.div
                      animate={{ rotate: userToggle ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IoChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {userToggle && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl 
                         border border-gray-100 py-2 z-50 dropdown-animate"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900">
                            {userData.email}
                          </p>
                        </div>

                        <div className="py-2">
                          <NavLink
                            to={`/profile/${userData.id}`}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                     ${
                       isActive
                         ? "text-purple-600 bg-purple-50"
                         : "text-gray-700 hover:bg-gray-50"
                     }`
                            }
                          >
                            <FaUserLarge className="w-4 h-4" />
                            Profile
                          </NavLink>

                          <NavLink
                            to={`/history/${userData.id}`}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                     ${
                       isActive
                         ? "text-purple-600 bg-purple-50"
                         : "text-gray-700 hover:bg-gray-50"
                     }`
                            }
                          >
                            <FaHistory className="w-4 h-4" />
                            History
                          </NavLink>

                          <NavLink
                            to={`/dashboard/${userData.id}`}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                     ${
                       isActive
                         ? "text-purple-600 bg-purple-50"
                         : "text-gray-700 hover:bg-gray-50"
                     }`
                            }
                          >
                            <MdLeaderboard className="w-4 h-4" />
                            Dashboard
                          </NavLink>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleLogOut}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 
                             hover:bg-red-50 transition-colors w-full"
                          >
                            <IoExitOutline className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login?type=teacher"
                  className="text-gray-700 hover:text-purple-600 transition-colors px-4 py-2"
                >
                  Are you a tutor?
                </Link>
                <Link
                  to="/login?type=student"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 
                   text-white hover:from-indigo-600 hover:to-purple-600 
                   transition-all duration-200 shadow-md shadow-purple-500/20"
                >
                  Sign In
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="bg-white">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <motion.h1
              className="text-5xl md:text-8xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Quiz
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-orange-600">
                Master
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Elevate your knowledge through interactive learning
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white 
                     rounded-full font-bold text-lg shadow-lg shadow-purple-500/25
                     hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
              onClick={showQuizzes}
            >
              Start Your Journey
            </motion.button>
          </motion.div>
        </section>

        {/* Quizzes Section */}
        <section
          ref={quizzesRef}
          className="h-screen relative bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
            <div className="absolute w-96 h-96 bg-purple-100/50 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700"></div>
            <div className="absolute w-full h-full bg-[url('/grid-light.png')] opacity-10"></div>
          </div>

          {/* Main content */}
          <div className="relative z-10 container mx-auto px-4 py-16 h-full">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="h-full flex flex-col"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold text-center mb-12"
              >
                <span className="">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    Explore Knowledge Realms
                  </span>
                </span>
              </motion.h2>

              <motion.div
                variants={fadeInUp}
                className="flex-1 overflow-y-auto custom-scrollbar-light"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
                  {quizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz._id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      viewport={{ once: true }}
                      className="transform perspective-1000"
                    >
                      <QuizCard quiz={quiz} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-10 w-3 h-3 bg-indigo-400 rounded-full animate-float opacity-50"></div>
            <div className="absolute top-1/3 right-20 w-2 h-2 bg-purple-400 rounded-full animate-float-delay opacity-50"></div>
            <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-pink-400 rounded-full animate-float opacity-50"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="h-screen relative overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-white px-4">
  {/* Geometric Background Patterns */}
  <div className="absolute inset-0">
    <div className="absolute w-full h-full">
      {/* Geometric shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-100/50 rounded-full mix-blend-multiply blur-xl animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-indigo-100/50 rounded-full mix-blend-multiply blur-xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-100/50 rounded-full mix-blend-multiply blur-xl animate-blob animation-delay-4000"></div>
    </div>
    <div className="absolute inset-0 backdrop-blur-[1px]"></div>
  </div>

  <motion.div
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    variants={stagger}
    className="max-w-7xl mx-auto relative z-10 h-full flex flex-col justify-center"
  >
    <motion.div
      variants={fadeInUp}
      className="text-center mb-16"
    >
      <span className="inline-block text-sm font-semibold text-purple-600 tracking-wider mb-2">
        DISCOVER THE DIFFERENCE
      </span>
      <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600">
        Why Choose QuizMaster?
      </h2>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 px-4">
      {[
        {
          icon: <FaRocket className="w-7 h-7" />,
          title: "Interactive Learning",
          description:
            "Engage with dynamic quizzes that make learning fun and effective",
          gradient: "from-purple-500 to-indigo-500",
          borderGlow: "group-hover:shadow-purple-500/20",
        },
        {
          icon: <FaBrain className="w-7 h-7" />,
          title: "Adaptive Difficulty",
          description:
            "Progress through increasingly challenging content at your own pace",
          gradient: "from-indigo-500 to-purple-500",
          borderGlow: "group-hover:shadow-indigo-500/20",
        },
        {
          icon: <FaChartLine className="w-7 h-7" />,
          title: "Track Progress",
          description:
            "Monitor your improvement with detailed analytics and insights",
          gradient: "from-pink-500 to-purple-500",
          borderGlow: "group-hover:shadow-pink-500/20",
        },
      ].map((feature, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          whileHover={{ y: -5 }}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-15 transition duration-500"></div>
          <div className={`relative p-6 md:p-8 rounded-2xl bg-white border border-purple-100/50
                        shadow-lg hover:shadow-xl ${feature.borderGlow}
                        transition-all duration-300`}
          >
            {/* Icon Container */}
            <div className="mb-6 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-sm opacity-30"></div>
              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} 
                           flex items-center justify-center text-white
                           transform transition-transform duration-300 group-hover:scale-110`}
              >
                {feature.icon}
              </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-slate-800 mb-3 group-hover:text-purple-600
                         transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {feature.description}
            </p>

            {/* Decorative corner lines */}
            <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
              <div className="absolute top-4 right-4 w-[1px] h-6 bg-purple-200 
                           transform origin-top transition-transform duration-300 
                           group-hover:scale-y-150 group-hover:bg-purple-400"></div>
              <div className="absolute top-4 right-4 w-6 h-[1px] bg-purple-200 
                           transform origin-right transition-transform duration-300 
                           group-hover:scale-x-150 group-hover:bg-purple-400"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>

  {/* Decorative floating elements */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute h-1 w-1 bg-purple-400 rounded-full top-1/4 left-1/4 animate-ping opacity-70"></div>
    <div className="absolute h-1 w-1 bg-indigo-400 rounded-full top-1/2 right-1/4 animate-ping opacity-70 animation-delay-1000"></div>
    <div className="absolute h-1 w-1 bg-pink-400 rounded-full bottom-1/4 left-1/2 animate-ping opacity-70 animation-delay-2000"></div>
  </div>
</section>
      </main>
    </div>
  );
}
