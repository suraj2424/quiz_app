import { useState, useEffect, useContext, useRef } from "react";
import QuizCard from "./QuizCard";
import { Link } from "react-router-dom";
import { FaUserLarge } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import { TokenContext } from "../contexts/TokenContextProvider";

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
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-sky-600">
            QuizMaster
          </h1>
          <nav className="font-semibold">
            {userData ? (
              <div className="flex relative space-x-4">
                {userData.type === "teacher" && (
                  <Link
                    to="/create-quiz"
                    className="hover:text-sky-300 transition-all flex items-center gap-2"
                  >
                    Create Quiz
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <FaUserLarge />
                  <span
                    onClick={() => setUserToggle(!userToggle)}
                    className="cursor-pointer"
                  >
                    {userData.name}
                  </span>
                  {userToggle && (
                    <div className="absolute border border-gray-300 top-10 right-2 rounded-lg space-y-4 bg-white shadow-lg w-56 px-6 py-6">
                      <Link
                        to={`/profile/${userData.id}`}
                        className="hover:text-gray-500 transition-all flex items-center justify-between"
                      >
                        Profile <FaUserLarge />
                      </Link>
                      <Link
                        to={`/history/${userData.id}`}
                        className="hover:text-gray-500 transition-all flex items-center justify-between"
                      >
                        History <FaHistory />
                      </Link>
                      <Link
                        to={`/dashboard/${userData.id}`}
                        className="hover:text-gray-500 transition-all ease-in-out flex items-center justify-between"
                      >
                        Leaderboard <MdLeaderboard />
                      </Link>
                      <button
                        onClick={handleLogOut}
                        className="hover:text-red-600 transition-all ease-in-out flex items-center justify-between gap-4"
                      >
                        Logout <IoExitOutline />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-x-3">
                <Link to="/login?type=teacher">Are you a tutor?</Link>
                <Link to="/login?type=student">Sign In</Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="text-center h-[calc(100vh-64px)]">
          <div className="pt-32">
            <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-pink-600">
              Welcome to QuizMaster
            </h1>
            <p className="mt-4 text-xl text-gray-800">
              Test your knowledge across various subjects!
            </p>
            <button
              className="p-2 mt-10 border rounded w-72 border-gray-400 hover:bg-gray-800 hover:text-white font-semibold transition-all"
              onClick={showQuizzes}
            >
              GET STARTED
            </button>
          </div>
        </section>

        <section className="p-20" ref={quizzesRef}>
          <h2 className="text-2xl font-bold mb-8 space-x-3 text-black">
            <span>AVAILABLE</span>
            <span>QUIZZES</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
          <div className="flex justify-center">
            <button className="w-72 mt-10 p-2 font-bold border border-gray-500 rounded hover:text-white hover:bg-gray-700 transition-all">
              SEE MORE
            </button>
          </div>
        </section>

        <section className="mt-16 text-center px-20 mb-10">
          <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
            Why Choose QuizMaster?
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Unlock the potential of interactive learning with QuizMaster. Designed
            to engage, challenge, and help you master a diverse range of topics
            while tracking your progress.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Diverse Topics
              </h3>
              <p className="text-gray-600">
                Explore a wide range of subjects from science to art, ensuring
                comprehensive knowledge building.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Adaptive Difficulty
              </h3>
              <p className="text-gray-600">
                Quizzes adjust to match your learning curve, offering increasing
                challenges.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Get insights into your performance with detailed analytics and
                progress tracking.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}