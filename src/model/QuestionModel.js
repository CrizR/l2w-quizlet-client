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


    toJSON() {
        return {
            "question": this.question,
            "correctAnswers": this.correctAnswers,
            "timeLimit": this.timeLimit,
            "answers": this.answers
        }
    }

    reset() {
        this._box = 0;
        this._repetitions = 0;
    }

    seen() {
        this._repetitions += 1;
    }

    demote(interval) {
        this._box = Math.max(this._box - interval, 0);
        this._repetitions += 1;
    }

    promote(interval, max) {
        this._box = Math.min(this._box + interval, max);
        this._repetitions += 1;
    }

    get box() {
        return this._box;
    }


    get repetitions() {
        return this._repetitions;
    }
}

export default Question