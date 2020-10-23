import Question, {LEITNER_CONFIG} from "./QuestionModel";

class Quiz {

    constructor(id, name, time, questions) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.questions = questions

    }

    static fromStorage(quiz) {
        return new Quiz(quiz.Id, quiz.name, quiz.time,
            quiz.questions.map((question) => Question.fromStorage(question)))
    }

    maxScore() {
        let score = 0;
        this.questions.forEach(question => {
            score += question.calculateScore(new Set(question.correctAnswers), 0);
        });
        return score * LEITNER_CONFIG.BOXES

    }


}

export default Quiz