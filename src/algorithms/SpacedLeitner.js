import Question from "../model/QuestionModel";
import Heap from "heap-js";

export const LEITNER_CONFIG = {
    BOXES: 3,
    DEMOTION_INTERVAL: 1,
    PROMOTION_INTERVAL: 1,
};

const SCORE_MULTIPLIER = 1000;
const GRACE_MULTIPLIER = .5;

function questionComparator(q1, q2) {
    return q1.box - q2.box
}


class SpacedLeitner {

    /**
     * Initializes the state for a quiz using SpacedLeitner
     * @param quiz
     * @returns state for reducer
     */
    static initialize(quiz) {
        let questionHeap = new Heap(questionComparator);

        quiz.questions.forEach(question => {
            questionHeap.push(Question.fromStorage(question))
        });

        let obj = {
            quizName: quiz.name,
            maxScore: SpacedLeitner.maxScore(quiz.questions),
            currentSession: questionHeap,
            nextSession: new Heap(questionComparator),
            questionsFinished: 0,
            totalQuestions: questionHeap.size() * LEITNER_CONFIG.BOXES,
            currentQuestion: questionHeap.peek(),
            isExamEnded: false,
            quizTime: quiz.time,
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
    }

    /**
     * Updates the state given the user's answers and updates the current question
     * @param state the state to update
     * @param answers the answers submitted by the user
     * @param skip boolean used to determine whether or not the question was skipped
     * @returns {*}
     */
    static nextFlashcard(state, answers, skip = false) {
        let currentSession = state.currentSession; // Should I clone?
        let nextSession = state.nextSession;// Should I clone?
        let currentQuestion = state.currentQuestion;
        let question = currentSession.pop();
        let tta = new Date() - state.questionStartTime;
        let score = SpacedLeitner.calculateScore(currentQuestion, answers, tta);
        let isCorrect = SpacedLeitner.isCorrectAnswers(currentQuestion, answers);
        let isExamEnded = false;
        let questionsFinished = state.questionsFinished;

        if (isCorrect) {
            question.promote(LEITNER_CONFIG.PROMOTION_INTERVAL, LEITNER_CONFIG.BOXES);
            questionsFinished = Math.min(questionsFinished + LEITNER_CONFIG.PROMOTION_INTERVAL, state.totalQuestions);
            if (question.box < LEITNER_CONFIG.BOXES) {
                nextSession.push(question);
            }
        } else {
            if (!skip) {
                questionsFinished = question.box > 0 ?
                    Math.max(questionsFinished - LEITNER_CONFIG.DEMOTION_INTERVAL, 0)
                    : questionsFinished;
                question.demote(LEITNER_CONFIG.DEMOTION_INTERVAL);
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

    /**
     * Calculate a submissions score given the question, answers and time to answer
     * @param question the question they answered
     * @param answers the answers they submitted
     * @param timeToAnswer the amount of time it took in seconds to submit
     * @returns {number} score
     */
    static calculateScore(question, answers, timeToAnswer) {
        let answeredCorrectly = 0;
        let possibleAnswers = new Set(question.correctAnswers);

        if (!!answers) {
            answers.forEach(answer => {
                if (possibleAnswers.has(answer)) {
                    answeredCorrectly += 1
                }
            });

            // Percentage of seconds left out of the timeLimit
            let secondsLeft = (question.timeLimit - (timeToAnswer / 1000));
            // Percentage of seconds left * possible points
            // Gives at most all possible points
            let speedPoints = (secondsLeft / question.timeLimit) * answeredCorrectly;
            // At most you receive double the amount of points if you answered questions immediately
            let possiblePoints = (answeredCorrectly + speedPoints) * SCORE_MULTIPLIER;
            let wrongAnswers = answers.size - answeredCorrectly;

            if (wrongAnswers === 0 && answeredCorrectly === question.correctAnswers.length) {

                return question.repetitions >= LEITNER_CONFIG.BOXES ? 0 : possiblePoints
            } else {
                return question.repetitions >= LEITNER_CONFIG.BOXES ? 0 :
                    (wrongAnswers * GRACE_MULTIPLIER * SCORE_MULTIPLIER) * -1
            }
        }
        return 0
    }

    /**
     * Update the state if the timeLimit was reached
     * @param state
     * @returns {*}
     */
    static timeLimitReached(state) {
        return Object.assign({}, state, {
            score: Math.round(state.score / 2),
            isExamEnded: true,
            timeLimitReached: true
        });
    }

    /**
     * Reset the state to its initial state
     * @param state
     * @returns {*}
     */
    static restart(state) {
        localStorage.clear();
        let obj = {
            initialQuizState: state.initialQuizState,
            ...state.initialQuizState
        };
        obj.quizStartTime = new Date();
        obj.questionStartTime = new Date();
        let newSession = new Heap(questionComparator);
        for (const question of obj.currentSession.clone()) {
            question.reset();
            newSession.push(question)
        }

        obj.currentSession = newSession;

        return Object.assign({}, {}, obj);
    }

    /**
     * Determines if the given answers are correct for the question
     * @param question to compare against
     * @param answers submitted answers
     * @returns {boolean} whether or not they are all correct
     */
    static isCorrectAnswers(question, answers) {
        let possibleAnswers = new Set(question.correctAnswers);
        let answeredCorrectly = 0;
        if (!!answers) {
            answers.forEach(answer => {
                if (possibleAnswers.has(answer)) {
                    answeredCorrectly += 1
                }
            });
            let wrongAnswers = answers.size - answeredCorrectly;
            return wrongAnswers === 0 && answeredCorrectly === question.correctAnswers.length;
        }

        return false
    }


    /**
     * Max score for a set of questions
     * @param questions to get max score for
     * @returns {number} max score
     */
    static maxScore(questions) {
        let score = 0;
        questions.forEach(question => {
            score += SpacedLeitner.calculateScore(question, new Set(question.correctAnswers), 0);
        });
        return score * LEITNER_CONFIG.BOXES

    }
}

export default SpacedLeitner