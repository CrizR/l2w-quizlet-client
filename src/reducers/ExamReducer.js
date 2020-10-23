import Heap from 'heap-js';
import Question, {LEITNER_CONFIG} from "../model/QuestionModel";
import {
    CLEAR_STORAGE,
    INITIALIZE_EXAM,
    REDO_EXAM,
    SKIP_QUESTION,
    SUBMIT_ANSWERS,
    TIME_LIMIT_REACHED
} from "../actions/ExamActions";

function questionComparator(q1, q2) {
    return q1.box - q2.box
}

const initialState = {
    quizName: "",
    currentSession: new Heap(questionComparator),
    nextSession: new Heap(questionComparator),
    currentQuestion: new Question(),
    totalQuestions: 0,
    questionsFinished: 0,
    questionStartTime: new Date(),
    quizStartTime: new Date(),
    score: 0,
    quizTime: 0,
    maxSCore: 0,
    isExamEnded: false,
    timeLimitReached: false,
};


const ExamReducer = (state = initialState, action) => {

    switch (action.type) {
        case INITIALIZE_EXAM:
            return buildQuiz(action);
        case SUBMIT_ANSWERS: {
            if (!!state.currentQuestion) {
                let score = state.currentQuestion.calculateScore(action.answers, new Date() - state.questionStartTime);
                return nextFlashcard(state, score, state.currentQuestion.isCorrectAnswers(action.answers), false)
            } else {
                return Object.assign({}, state, {});
            }
        }

        case SKIP_QUESTION:
            return nextFlashcard(state, 0, false, true);

        case TIME_LIMIT_REACHED: {
            return Object.assign({}, state, {
                score: Math.round(state.score / 2),
                isExamEnded: true,
                timeLimitReached: true
            });
        }

        case CLEAR_STORAGE: {
            localStorage.clear();
            return initialState;
        }
        case REDO_EXAM:
            localStorage.clear();
            let obj = {
                initialQuizState: state.initialQuizState,
                ...state.initialQuizState
            };
            obj.quizStartTime = new Date();
            obj.questionStartTime = new Date();
            obj.currentSession = resetQuestions(obj.currentSession.clone());

            return Object.assign({}, {}, obj);
        default:
            return state;
    }
};


function resetQuestions(session) {
    let newSession = new Heap(questionComparator);
    for (const question of session) {
        question.reset();
        newSession.push(question)
    }
    return newSession
}


function nextFlashcard(state, score, isCorrect, skip) {

    let currentSession = state.currentSession.clone();
    let nextSession = state.nextSession.clone();
    let question = currentSession.pop();
    let isExamEnded = false;
    let questionsFinished = state.questionsFinished;

    if (isCorrect) {
        question.promote();
        questionsFinished = Math.min(questionsFinished + LEITNER_CONFIG.PROMOTION_INTERVAL, state.totalQuestions);
        if (question.box < LEITNER_CONFIG.BOXES) {
            nextSession.push(question);
        }
    } else {

        if (!skip) {
            questionsFinished = question.box > 0 ?
                Math.max(questionsFinished - LEITNER_CONFIG.DEMOTION_INTERVAL, 0)
                : questionsFinished;
            question.demote();
        }
        nextSession.push(question);
    }

    // If our current session is done
    if (!currentSession.size()) {

        // if our next session is also done, end the exam (all questions have been finished)
        if (!nextSession.size()) {
            isExamEnded = true;
        }

        // if next session isn't empty, replace current session with next and reset next
        currentSession = nextSession;
        nextSession = new Heap(questionComparator)
    }


    return Object.assign({}, state, {
        score: !skip ? state.score + score : state.score,
        currentSession: currentSession,
        nextSession: nextSession,
        isExamEnded: isExamEnded,
        questionsFinished: questionsFinished,
        questionStartTime: new Date(),
        currentQuestion: currentSession.peek()
    });

}

const buildQuiz = (action) => {

    let questionHeap = new Heap(questionComparator);

    action.quiz.questions.forEach(question => {
        questionHeap.push(Question.fromStorage(question))
    });

    let obj = {
        quizName: action.quiz.name,
        maxScore: action.quiz.maxScore(),
        currentSession: questionHeap,
        nextSession: new Heap(questionComparator),
        questionsFinished: 0,
        totalQuestions: questionHeap.size() * LEITNER_CONFIG.BOXES,
        currentQuestion: questionHeap.peek(),
        isExamEnded: false,
        quizTime: action.quiz.time,
        quizStartTime: new Date(),
        questionStartTime: new Date(),
        timeLimitReached: false,
        score: 0
    };

    let quizState = {
        initialQuizState: obj,
        ...obj
    };

    quizState.currentSession = questionHeap.clone();

    return quizState

};

export default ExamReducer