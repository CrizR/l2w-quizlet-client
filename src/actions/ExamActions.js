import {getQuiz} from "../services/QuizService";

export const SUBMIT_ANSWERS = "SUBMIT_ANSWERS";
export const SKIP_QUESTION = "SKIP_QUESTION";
export const REDO_EXAM = 'REDO_EXAM';
export const CLEAR_STORAGE = 'RESET_EXAM';
export const TIME_LIMIT_REACHED = 'TIME_LIMIT_REACHED';
export const INITIALIZE_EXAM = 'INITIALIZE_EXAM';

export function skipQuestionAction(dispatch) {
    return dispatch({
        type: SKIP_QUESTION,
    });
}

export function submitAnswersAction(dispatch, answers) {
    return dispatch({
        type: SUBMIT_ANSWERS,
        answers: answers
    });
}

export const redoExamAction = (dispatch) => {
    return dispatch({
        type: REDO_EXAM
    });
};

export const clearExamStorageAction = (dispatch) => {
    return dispatch({
        type: CLEAR_STORAGE
    });
};

export const timeLimitReachedAction = (dispatch) => {
    return dispatch({
        type: TIME_LIMIT_REACHED
    });
};


export function initializeExamAction(dispatch, id) {
    getQuiz(id).then((quiz) => {
        return dispatch({
            type: INITIALIZE_EXAM,
            quiz: quiz
        });
    })
}