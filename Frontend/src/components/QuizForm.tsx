import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { Cookies } from "react-cookie";

interface Option {
  optionText: string;
  isCorrect: boolean;
}

interface Question {
  questionType: "Multiple Choice" | "True/False" | "Short Answer";
  questionText: string;
  options: Option[];
  correctAnswer?: string; // Add this for Short Answer questions
  hint?: string;
  answerExplanation: string;
  points: number;
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
}

const QuizForm: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz>({
    title: "",
    description: "",
    noOfQuestions: 0,
    difficulty: "EASY",
    timeLimit: 0,
    randomizeQuestions: false,
    randomizeOptions: false,
    tags: [],
    category: "",
    questions: [],
    status: "Draft",
  });
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const timer = setTimeout(() => {
      setLoading(false);
    },2000);
    return () => clearTimeout(timer);
  },[])

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addQuestion = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [
        ...prevQuiz.questions,
        {
          questionType: "Multiple Choice",
          questionText: "",
          options: [
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },{ optionText: "", isCorrect: false },{ optionText: "", isCorrect: false },
          ],
          hint: "",
          answerExplanation: "",
          points: 1,
        },
      ],
      noOfQuestions: prevQuiz.noOfQuestions + 1,
    }));
  };

  const removeQuestion = (index: number) => {
    setQuiz((prevQuiz) => {
      const newQuestions = [...prevQuiz.questions];
      newQuestions.splice(index, 1);
      return {
        ...prevQuiz,
        questions: newQuestions,
        noOfQuestions: prevQuiz.noOfQuestions - 1,
      };
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => ({ ...prevQuiz, [name]: value }));
  };

  const handleQuestionChange = (
    index: number,
    name: keyof Question,
    value: string | Option[]
  ) => {
    setQuiz((prevQuiz) => {
      const newQuestions = [...prevQuiz.questions];
      newQuestions[index] = { ...newQuestions[index], [name]: value };

      // Adjust options based on question type
      if (name === "questionType") {
        switch (value) {
          case "Multiple Choice":
            newQuestions[index].options = [
              { optionText: "", isCorrect: false },
              { optionText: "", isCorrect: false },
              { optionText: "", isCorrect: false },
              { optionText: "", isCorrect: false },
            ];
            newQuestions[index].correctAnswer = undefined;
            break;
          case "True/False":
            newQuestions[index].options = [
              { optionText: "True", isCorrect: false },
              { optionText: "False", isCorrect: false },
            ];
            newQuestions[index].correctAnswer = undefined;
            break;
          case "Short Answer":
            newQuestions[index].options = [];
            newQuestions[index].correctAnswer = "";
            break;
        }
      }

      return { ...prevQuiz, questions: newQuestions };
    });
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setQuiz((prevQuiz) => {
      const newQuestions = [...prevQuiz.questions];
      newQuestions[questionIndex].options[optionIndex].optionText = value;
      return { ...prevQuiz, questions: newQuestions };
    });
  };

  const handleCorrectOptionChange = (
    questionIndex: number,
    optionIndex: number
  ) => {
    setQuiz((prevQuiz) => {
      const newQuestions = [...prevQuiz.questions];
      newQuestions[questionIndex].options = newQuestions[
        questionIndex
      ].options.map((option, i) => ({
        ...option,
        isCorrect: i === optionIndex,
      }));
      return { ...prevQuiz, questions: newQuestions };
    });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz((prevQuiz) => ({ ...prevQuiz, tags: e.target.value.split(",") }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!quiz.title.trim()) newErrors.title = "Title is required";
    if (!quiz.description.trim())
      newErrors.description = "Description is required";
    if (quiz.timeLimit <= 0)
      newErrors.timeLimit = "Time limit must be greater than 0";
    if (quiz.questions.length === 0)
      newErrors.questions = "At least one question is required";

    quiz.questions.forEach((question, index) => {
      if (!question.questionText.trim())
        newErrors[`question-${index}`] = "Question text is required";
      if (question.questionType !== "Short Answer") {
        if (question.options.some((option) => !option.optionText.trim()))
          newErrors[`options-${index}`] = "All options must be filled";
        if (!question.options.some((option) => option.isCorrect))
          newErrors[`correct-${index}`] =
            "At least one correct answer is required";
      }
      if (!question.answerExplanation.trim())
        newErrors[`explanation-${index}`] = "Answer explanation is required";
      if (question.points <= 0)
        newErrors[`points-${index}`] = "Points must be greater than 0";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const cookies = new Cookies();
      const token = cookies.get("token");
      const response = await fetch("http://localhost:5000/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quiz),
      });

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      const data = await response.json();
      console.log("Quiz created successfully:", data);
      alert("Quiz created successfully");
      // Here you can add logic to redirect or show a success message
    } catch (error) {
      console.error("Error creating quiz:", error);
      setErrors({ submit: "Failed to create quiz. Please try again." });
    }
  };

  const RequiredAsterisk = () => <span className="text-red-500 ml-1">*</span>;

  if(loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-violet-600">
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-900 py-12"
    >
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-10 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Create New Quiz
          </h1>
          {errors.submit && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.submit}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quiz Title
                  <RequiredAsterisk />
                </label>
                <input
                  type="text"
                  name="title"
                  value={quiz.title}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter quiz title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                  <RequiredAsterisk />
                </label>
                <textarea
                  name="description"
                  value={quiz.description}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter quiz description"
                  rows={3}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={quiz.tags.join(",")}
                  onChange={handleTagsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter tags (comma separated)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    name="noOfQuestions"
                    value={quiz.noOfQuestions}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={quiz.difficulty}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time Limit (minutes)
                  <RequiredAsterisk />
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  value={quiz.timeLimit}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${
                    errors.timeLimit ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.timeLimit && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.timeLimit}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="randomizeQuestions"
                    checked={quiz.randomizeQuestions}
                    onChange={(e) =>
                      setQuiz((prevQuiz) => ({
                        ...prevQuiz,
                        randomizeQuestions: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Randomize Questions
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="randomizeOptions"
                    checked={quiz.randomizeOptions}
                    onChange={(e) =>
                      setQuiz((prevQuiz) => ({
                        ...prevQuiz,
                        randomizeOptions: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Randomize Options
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Questions
                <RequiredAsterisk />
              </h2>
              {errors.questions && (
                <p className="mt-1 text-sm text-red-500">{errors.questions}</p>
              )}
              {quiz.questions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-6 border rounded-lg bg-gray-50 relative"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Question {index + 1}
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Question Type
                    </label>
                    <select
                      value={question.questionType}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "questionType",
                          e.target.value as Question["questionType"]
                        )
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Multiple Choice">Multiple Choice</option>
                      <option value="True/False">True/False</option>
                      <option value="Short Answer">Short Answer</option>
                    </select>
                  </div>

                  <textarea
                    value={question.questionText}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        "questionText",
                        e.target.value
                      )
                    }
                    className={`w-full px-3 py-2 border ${
                      errors[`question-${index}`]
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter question text"
                    rows={3}
                  />
                  {errors[`question-${index}`] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[`question-${index}`]}
                    </p>
                  )}

                  {question.questionType === "Short Answer" ? (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Correct Answer
                        <RequiredAsterisk />
                      </label>
                      <input
                        type="text"
                        value={question.correctAnswer || ""}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "correctAnswer",
                            e.target.value
                          )
                        }
                        className={`mt-1 block w-full border ${
                          errors[`correct-${index}`]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter correct answer"
                      />
                      {errors[`correct-${index}`] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[`correct-${index}`]}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium text-gray-700">Options</h4>
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name={`isCorrect-${index}`}
                            checked={option.isCorrect}
                            onChange={() =>
                              handleCorrectOptionChange(index, optionIndex)
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <input
                            type="text"
                            value={option.optionText}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                optionIndex,
                                e.target.value
                              )
                            }
                            className={`flex-grow px-3 py-2 border ${
                              errors[`options-${index}`]
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder={`Option ${optionIndex + 1}`}
                            readOnly={question.questionType === "True/False"}
                          />
                        </div>
                      ))}
                      {errors[`options-${index}`] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[`options-${index}`]}
                        </p>
                      )}
                      {errors[`correct-${index}`] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[`correct-${index}`]}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Hint (Optional)
                    </label>
                    <textarea
                      value={question.hint}
                      onChange={(e) =>
                        handleQuestionChange(index, "hint", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter hint (optional)"
                      rows={2}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Answer Explanation
                      <RequiredAsterisk />
                    </label>
                    <textarea
                      value={question.answerExplanation}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "answerExplanation",
                          e.target.value
                        )
                      }
                      className={`mt-1 block w-full border ${
                        errors[`explanation-${index}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter answer explanation"
                      rows={3}
                    />
                    {errors[`explanation-${index}`] && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[`explanation-${index}`]}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Points
                      <RequiredAsterisk />
                    </label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={(e) =>
                        handleQuestionChange(index, "points", e.target.value)
                      }
                      className={`mt-1 block w-full border ${
                        errors[`points-${index}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter points for this question"
                    />
                    {errors[`points-${index}`] && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[`points-${index}`]}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 focus:outline-none"
                  >
                    <AiOutlineClose size={24} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center text-indigo-600 hover:text-indigo-900"
              >
                <AiOutlinePlus size={20} className="mr-2" />
                Add Question
              </button>

              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizForm;
