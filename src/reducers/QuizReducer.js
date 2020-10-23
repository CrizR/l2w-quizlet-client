import {CREATE_QUIZ, DELETE_QUIZ, GET_QUIZZES} from "../actions/QuizActions";



const initialState = {
    quizzes: [],
};


const QuizReducer = (state = initialState, action) => {

    switch (action.type) {
        case CREATE_QUIZ: {
            let quizzes = state.quizzes;
            quizzes.push(action.quiz);
            return Object.assign({}, state, {
                quizzes: quizzes
            })
        }
        case DELETE_QUIZ: {
            let qs = state.quizzes.filter(quiz => quiz.id !== action.id);
            return Object.assign({}, state, {
                quizzes: qs
            })
        }
        case GET_QUIZZES: {
            return Object.assign({}, state, {
                quizzes: action.quizzes
            })
        }
        default:
            return state;
    }
};


export default QuizReducer