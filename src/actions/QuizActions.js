import {createQuiz, deleteQuiz, getQuizzes} from "../services/QuizService";

export const CREATE_QUIZ = "CREATE_QUIZ";
export const DELETE_QUIZ = "DELETE_QUIZ";
export const GET_QUIZZES = "GET_QUIZZES";

export function createQuizAction(dispatch, quizObj) {
    createQuiz(quizObj).then(quiz => {
        return dispatch({
            type: CREATE_QUIZ,
            quiz: quiz
        });
    })
}

export function deleteQuizAction(dispatch, id) {
    deleteQuiz(id).then(() => {
        return dispatch({
            type: DELETE_QUIZ,
            id: id
        });
    })
}

export function getQuizzesAction(dispatch) {
    getQuizzes().then(quizzes => {
        return dispatch({
            type: GET_QUIZZES,
            quizzes: quizzes
        });
    })

}