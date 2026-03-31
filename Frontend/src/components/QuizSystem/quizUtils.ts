import { Question } from "./types";

const normalizeValue = (value: string | number) =>
  String(value).trim().toLowerCase();

export const isAnswerCorrect = (
  question: Question,
  answer: string | number | undefined,
) => {
  if (answer === undefined || answer === null) {
    return false;
  }

  if (typeof answer === "number") {
    const selectedOption = question.options[answer];

    if (typeof selectedOption?.isCorrect === "boolean") {
      return selectedOption.isCorrect;
    }

    if (typeof question.correctAnswer === "number") {
      return answer === question.correctAnswer;
    }

    return (
      normalizeValue(selectedOption?.optionText ?? "") ===
      normalizeValue(question.correctAnswer)
    );
  }

  if (typeof question.correctAnswer === "number") {
    return (
      normalizeValue(answer) ===
      normalizeValue(question.options[question.correctAnswer]?.optionText ?? "")
    );
  }

  return normalizeValue(answer) === normalizeValue(question.correctAnswer);
};

export const countCorrectAnswers = (
  questions: Question[],
  answers: Record<number, string | number>,
) =>
  questions.reduce((total, question, index) => {
    return isAnswerCorrect(question, answers[index]) ? total + 1 : total;
  }, 0);

export const totalQuizPoints = (questions: Question[]) =>
  questions.reduce((total, question) => total + (question.points ?? 1), 0);

export const calculateQuizScore = (
  questions: Question[],
  answers: Record<number, string | number>,
) =>
  questions.reduce((total, question, index) => {
    return isAnswerCorrect(question, answers[index])
      ? total + (question.points ?? 1)
      : total;
  }, 0);
