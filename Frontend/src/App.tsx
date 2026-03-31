import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/home/Home";
import Quiz from "./components/quiz/Quiz";
import QuizForm from "./components/QuizForm";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Profile from "./components/pages/Profile";
import Dashboard from "./components/dashboard2/Dashboard";
import { QuizAnalytics } from "./components/analytics/QuizAnalytics";
import AttemptReview from "./components/attempts/AttemptReview";
import History from "./components/history/History";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
      <UserProvider>
        <Router>
          <div className="min-h-screen">
            <ToastContainer autoClose={1000} />
            <Routes>
              <Route path={`/quiz/:id`} element={<Quiz />} />
              <Route path={`/profile/:id`} element={<Profile />} />
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-quiz" element={<QuizForm />} />
              <Route path="/dashboard/:id" element={<Dashboard />} />
              <Route path="/analytics" element={<QuizAnalytics data={[]} />} />
              <Route path="/attempt/:id" element={<AttemptReview />} />
              <Route path="/history/:id" element={<History />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
  );
}

export default App;
