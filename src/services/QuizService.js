import Quiz from "../model/QuizModel";

const apiUrl = process.env.NODE_ENV === 'production' ? "https://l2w-quizlet-server.herokuapp.com/api" : "http://localhost:8080/api";

export const getQuizzes = () =>
    fetch(`${apiUrl}/quiz`)
        .then(response => response.json())
        .then(quizzes => {
            return quizzes.map((quiz) => Quiz.fromStorage(quiz))
        });

export const getQuiz = (id) =>
    fetch(`${apiUrl}/quiz/${id}`)
        .then(response => response.json())
        .then(quiz => Quiz.fromStorage(quiz.Item));


export const createQuiz = (quiz) =>
    fetch(`${apiUrl}/quiz/`,
        {
            method: 'POST',
            body: JSON.stringify(quiz),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(quiz => Quiz.fromStorage(quiz));


export const deleteQuiz = (id) =>
    fetch(`${apiUrl}/quiz/${id}`, {
        method: 'DELETE'
    });
