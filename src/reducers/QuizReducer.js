import {CREATE_QUIZ, DELETE_QUIZ, GET_QUIZZES, SEARCH_QUIZZES, SELECT_QUIZ, UPDATE_QUIZ} from "../actions/QuizActions";


const initialState = {
    quizzes: [],
    filtered: [],
    selected: {}
};


const QuizReducer = (state = initialState, action) => {

    switch (action.type) {
        case CREATE_QUIZ: {
            let quizzes = state.quizzes;
            quizzes.push(action.quiz);
            return Object.assign({}, state, {
                quizzes: quizzes,
                filtered: quizzes
            })
        }
        case UPDATE_QUIZ: {
            let qs = state.quizzes.filter(quiz => quiz.id !== action.id);
            qs.push(action.quiz);
            return Object.assign({}, state, {
                quizzes: qs,
                filtered: qs,
            })
        }
        case DELETE_QUIZ: {
            let qs = state.quizzes.filter(quiz => quiz.id !== action.id);
            return Object.assign({}, state, {
                quizzes: qs,
                filtered: qs
            })
        }
        case SELECT_QUIZ: {
            let select = state.quizzes.filter(quiz => quiz.id === action.id);
            return Object.assign({}, state, {
                selected: !!select.length ? select[0] : {}
            })
        }

        case GET_QUIZZES: {
            return Object.assign({}, state, {
                quizzes: action.quizzes,
                filtered: action.quizzes
            })
        }
        case SEARCH_QUIZZES: {
            let searchTerm = action.searchTerm.toUpperCase();
            let qs = state.quizzes.filter(quiz => quiz.name.toUpperCase().includes(searchTerm));
            return Object.assign({}, state, {
                filtered: qs
            })
        }
        default:
            return state;
    }
};


export default QuizReducer