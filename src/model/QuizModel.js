import Question from "./QuestionModel";

class Quiz {

    constructor(id, name, time, questions) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.questions = questions

    }

    static fromStorage(quiz) {
        return new Quiz(quiz.quiz_id, quiz.name, quiz.time,
            quiz.questions.map((question) => Question.fromStorage(question)))
    }


}

export default Quiz