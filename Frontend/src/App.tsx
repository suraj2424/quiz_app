import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import TokenContextProvider from "./contexts/TokenContextProvider";
import QuizForm from "./components/QuizForm";
import Register from "./components/Register";
import Login from "./components/Login"
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
function App() {
  return (
    <Router>
      <div className="min-w-screen min-h-screen">
        <ToastContainer autoClose={1000}/>
        <TokenContextProvider>
          <Routes>
            <Route path={`/quiz/:id`} element={<Quiz />} />
            <Route path={`/profile/:id`} element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-quiz" element={<QuizForm/>}/>
            <Route path="/dashboard/:id" element={<Dashboard/>}/>
          </Routes>
        </TokenContextProvider>
      </div>
    </Router>
  );
}

export default App;
