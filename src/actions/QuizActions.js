import {createQuiz, deleteQuiz, getQuizzes, updateQuiz} from "../services/QuizService";

export const CREATE_QUIZ = "CREATE_QUIZ";
export const UPDATE_QUIZ = "UPDATE_QUIZ";
export const DELETE_QUIZ = "DELETE_QUIZ";
export const GET_QUIZZES = "GET_QUIZZES";
export const SEARCH_QUIZZES = "SEARCH_QUIZZES";
export const SELECT_QUIZ = "SELECT_QUIZ";

export function createQuizAction(dispatch, user, quizObj, token) {
    return createQuiz(user, quizObj, token).then(quiz => {
        return dispatch({
            type: CREATE_QUIZ,
            quiz: quiz
        });
    })
}

export function updateQuizAction(dispatch, user, id, quizObj, token) {
    return updateQuiz(user, id, quizObj, token).then(quiz => {
        return dispatch({
            type: UPDATE_QUIZ,
            id: id,
            quiz: quiz
        });
    })
}

export function deleteQuizAction(dispatch, user, id, token) {
    return deleteQuiz(user, id, token).then(() => {
        return dispatch({
            type: DELETE_QUIZ,
            id: id
        });
    })
}

export function getQuizzesAction(dispatch, user, token) {
    return getQuizzes(user, token).then(quizzes => {
        return dispatch({
            type: GET_QUIZZES,
            quizzes: quizzes
        });
    })
}

export function selectQuizAction(dispatch, id) {
    return dispatch({
        type: SELECT_QUIZ,
        id: id
    });
}

export function searchQuizzesAction(dispatch, searchTerm) {
    return dispatch({
        type: SEARCH_QUIZZES,
        searchTerm: searchTerm,
    });
}