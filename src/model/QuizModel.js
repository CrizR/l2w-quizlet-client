import Question from "./QuestionModel";

class Quiz {

    constructor(id, name, time, questions) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.questions = questions

    }

    static fromStorage(quiz) {
        let quizObj = new Quiz(quiz.Id, quiz.name, quiz.time,
            quiz.questions.map((question) => Question.fromStorage(question)));
        return quizObj
    }



}

export default Quiz