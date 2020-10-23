export const LEITNER_CONFIG = {
    BOXES: 3,
    DEMOTION_INTERVAL: 1,
    PROMOTION_INTERVAL: 1,
};

const SCORE_MULTIPLIER = 1000;
const GRACE_MULTIPLIER = .5;

class Question {

    constructor(question, answers, correctAnswers, timeLimit) {
        // Initial Question Fields
        this.question = question;
        this.correctAnswers = correctAnswers;
        this.timeLimit = timeLimit;
        this.answers = answers;
        this._box = 0;
        this._repetitions = 0;
    }

    static fromStorage(obj) {
        return new Question(
            obj["question"],
            obj["answers"],
            obj["correctAnswers"],
            obj["timeLimit"])
    }


    isCorrectAnswers(answers) {
        let possibleAnswers = new Set(this.correctAnswers);
        let answeredCorrectly = 0;
        answers.forEach(answer => {
            if (possibleAnswers.has(answer)) {
                answeredCorrectly += 1
            }
        });
        return answeredCorrectly === answers.size && answeredCorrectly === this.correctAnswers.length;
    }


    calculateScore(answers, timeToAnswer) {
        let answeredCorrectly = 0;
        let possibleAnswers = new Set(this.correctAnswers);
        answers.forEach(answer => {
            if (possibleAnswers.has(answer)) {
                answeredCorrectly += 1
            }
        });

        // Percentage of seconds left out of the timeLimit
        let secondsLeft = (this.timeLimit - (timeToAnswer / 1000));
        // Percentage of seconds left * possible points
        // Gives at most all possible points
        let speedPoints = (secondsLeft / this.timeLimit) * answeredCorrectly;

        // At most you receive double the amount of points if you answered questions immediately
        let possiblePoints = (answeredCorrectly + speedPoints) * SCORE_MULTIPLIER;

        let wrongAnswers = answers.size - answeredCorrectly;

        console.log(wrongAnswers);

        if (wrongAnswers === 0 && answeredCorrectly === this.correctAnswers.length) {
            return this._repetitions >= LEITNER_CONFIG.BOXES ? 0 : possiblePoints
        } else {
            return this._repetitions >= LEITNER_CONFIG.BOXES ? 0 : (wrongAnswers * GRACE_MULTIPLIER * SCORE_MULTIPLIER) * -1
        }

    }

    reset() {
        this._box = 0;
        this._repetitions = 0;
    }

    demote() {
        this._box = Math.max(this._box - LEITNER_CONFIG.DEMOTION_INTERVAL, 0);
        this._repetitions += 1;
    }

    promote() {
        this._box = Math.min(this._box + LEITNER_CONFIG.PROMOTION_INTERVAL, LEITNER_CONFIG.BOXES);
        this._repetitions += 1;
    }

    get box() {
        return this._box;
    }
}

export default Question