import {
    INITIALIZE_EXAM,
    REDO_EXAM,
    SKIP_QUESTION,
    SUBMIT_ANSWERS,
    TIME_LIMIT_REACHED
} from "../actions/ExamActions";
import SpacedLeitner from "../algorithms/SpacedLeitner";

const ExamReducer = (state={}, action) => {

    switch (action.type) {
        case INITIALIZE_EXAM:
            return SpacedLeitner.initialize(action.quiz);
        case SUBMIT_ANSWERS:
            return SpacedLeitner.nextFlashcard(state, action.answers, false);
        case SKIP_QUESTION:
            return SpacedLeitner.nextFlashcard(state, [], true);
        case TIME_LIMIT_REACHED:
            return SpacedLeitner.timeLimitReached(state);
        case REDO_EXAM:
            return SpacedLeitner.restart(state);
        default:
            return state;
    }
};

export default ExamReducer