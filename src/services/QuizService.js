import Quiz from "../model/QuizModel";
const apiUrl = process.env.NODE_ENV === 'production' ? "https://l2w-quizlet-server.herokuapp.com/api" : "http://localhost:8080/api";


export const getQuizzes = (user, token) => {

    return fetch(`${apiUrl}/user/${user.email}/quiz`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(quizzes => {
            return quizzes.map((quiz) => Quiz.fromStorage(quiz))
        });
};


export const getQuiz = (user, id, token) =>
    fetch(`${apiUrl}/user/${user.email}/quiz/${id}`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        }
    )
        .then(response => response.json())
        .then(quiz => Quiz.fromStorage(quiz.Item));


export const createQuiz = (user, quiz, token) =>
    fetch(`${apiUrl}/user/${user.email}/quiz/`,
        {
            method: 'POST',
            body: JSON.stringify(quiz),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(quiz => Quiz.fromStorage(quiz));

export const updateQuiz = (user, id, quiz, token) =>
    fetch(`${apiUrl}/user/${user.email}/quiz/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(quiz),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(quiz => Quiz.fromStorage(quiz));


export const deleteQuiz = (user, id, token) =>
    fetch(`${apiUrl}/user/${user.email}/quiz/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    });
