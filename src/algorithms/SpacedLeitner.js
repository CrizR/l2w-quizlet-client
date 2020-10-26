import Question from "../model/QuestionModel";
import Heap from "heap-js";

export const LEITNER_CONFIG = {
    BOXES: 3,
    DEMOTION_INTERVAL: 1,
    PROMOTION_INTERVAL: 1,
    SCORE_MULTIPLIER: 1000,
    GRACE_MULTIPLIER: .5,
    TIME_LIMIT_REACHED_PUNISHMENT: .5
};


function questionComparator(q1, q2) {
    return q1.box - q2.box
}


class SpacedLeitner {

    /**
     * Initializes the state for a quiz using SpacedLeitner
     * @param quiz
     * @returns {*} state for reducer
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
     * Updates the state given the user's answers and updates the current question.
     *
     * Algorithm works as such:
     *
     * There are n boxes as defined in the LEITNER_CONFIG
     *
     * Each question/flashcard starts in the first box. For each correct answer, they are moved into the next (promote).
     * For each wrong answer they are moved backwards (demote). If a question gets to the last box, it is finished.
     *
     * This happens for each session where a session contains all of the current cards the user has not finished.
     * Each session is represented by a Heap where the questions with the lowest box values are at the top. (0,0,1,2,3)
     *
     * As questions are encountered and answered they are added to the next session but only if they haven't
     * reached the last box.
     *
     * Once the current session is empty, we then add all questions from the next session to the current session
     * and continue the quiz.
     *
     * Lastly, if a user decides to skip a card that's fine, but that counts as a repetition if they do.
     * The reason for doing this is so that a user doesn't get unlimited time for a question just by skipping ahead
     * until they get to that same question again.
     *
     * Overall complexities:
     *
     * Time: O(log(n) + k) (bottleneck occurs when adding to the heap and calculating score)
     * Space: O(n) (2 heaps storing each session)
     *
     * @param state the state to update
     * @param answers the answers submitted by the user
     * @param skip boolean used to determine whether or not the question was skipped
     * @returns {*}
     */
    static nextFlashcard(state, answers, skip = false) {
        let currentSession = state.currentSession;
        let nextSession = state.nextSession;
        let currentQuestion = state.currentQuestion;
        let question = currentSession.pop(); // log(n)
        let tta = new Date() - state.questionStartTime;
        // time O(k) where k = len(currentQuestion.correctAnswers)
        let score = SpacedLeitner.calculateScore(currentQuestion, answers, tta);
        //time O(k) where k = len(currentQuestion.correctAnswers)
        let isCorrect = SpacedLeitner.isCorrectAnswers(currentQuestion, answers);
        let isExamEnded = false;
        let questionsFinished = state.questionsFinished;

        if (skip) {
            question.seen();
            nextSession.push(question); // time log(n)
        } else if (isCorrect) {
            question.promote(LEITNER_CONFIG.PROMOTION_INTERVAL, LEITNER_CONFIG.BOXES); // time O(1)
            questionsFinished = Math.min(
                questionsFinished + LEITNER_CONFIG.PROMOTION_INTERVAL,
                state.totalQuestions);

            if (question.box < LEITNER_CONFIG.BOXES) {
                nextSession.push(question); // time log(n)
            }
        } else {
            questionsFinished = question.box > 0 ?
                Math.max(questionsFinished - LEITNER_CONFIG.DEMOTION_INTERVAL, 0)
                : questionsFinished;
            question.demote(LEITNER_CONFIG.DEMOTION_INTERVAL); // time O(1)
            nextSession.push(question); // time log(n)
        }

        // If our current session is done
        if (!currentSession.size()) { // time O(1) I assume

            // if our next session is also done, end the exam (all questions have been finished)
            if (!nextSession.size()) { // time O(1) I assume
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
            currentQuestion: currentSession.peek() // time O(1)
        });
    }

    /**
     * Calculate a submissions score given the question, answers and time to answer
     *
     * There are multiple ways to handle this, I went with the following:
     *
     * Firs way is for is users gain full points or more for quickly answered questions, less points
     * for partially answered questions and zero or less points for wrong answers. However, in order to to make this
     * method work only the first n repetitions for a card where n = max boxes would be allowed to receive any points.
     *
     *
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
            let possiblePoints = (answeredCorrectly + speedPoints) * LEITNER_CONFIG.SCORE_MULTIPLIER;
            let wrongAnswers = answers.size - answeredCorrectly;


            // You only get points if this questions repetitions is less than the number of boxes
            // i.e if you've seen gotten this card partially right 3 times already, you don't get a chance
            // to then get more points by answering it right 3 times after. And you still need to finish the quiz
            // otherwise your total points gets halved
            if (wrongAnswers === 0 && answeredCorrectly === question.correctAnswers.length) {
                return question.repetitions >= LEITNER_CONFIG.BOXES ? 0 : possiblePoints
            } else if (wrongAnswers === 0) {
                // Case of partial credit (with no wrong answers)
                return question.repetitions >= LEITNER_CONFIG.BOXES ? 0 : possiblePoints * LEITNER_CONFIG.GRACE_MULTIPLIER

            } else {
                // Negative to prevent guessing
                return question.repetitions >= LEITNER_CONFIG.BOXES ? 0 :
                    (wrongAnswers * LEITNER_CONFIG.GRACE_MULTIPLIER * LEITNER_CONFIG.SCORE_MULTIPLIER) * -1
            }

        }
        return 0
    }

    /**
     * Update the state if the timeLimit was reached.
     *
     * Your score is reduced as a result.
     *
     * @param state
     * @returns {*}
     */
    static timeLimitReached(state) {
        return Object.assign({}, state, {
            score: Math.round(state.score / LEITNER_CONFIG.TIME_LIMIT_REACHED_PUNISHMENT),
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