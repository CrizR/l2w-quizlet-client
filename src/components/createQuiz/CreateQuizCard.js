import React, {useState} from 'react';
import "./CreateQuizCardStyle.css"
import {
    Button,
    Grid,
    Modal,
} from "semantic-ui-react";
import {connect} from "react-redux";
import {createQuizAction, getQuizzesAction} from "../../actions/QuizActions";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import {v4 as uuid} from "uuid";

const sampleQuiz = {
    "name": "Sample Quiz",
    "time": 120,
    "questions": [
        {
            "question": "What is true about a rhombus?",
            "answers": [
                "All sides have equal length.",
                "A rhombus is a square.",
                "The altitude is the distance at right angles to two sides.",
                "Opposite angles are always equal."
            ],
            "correctAnswers": [
                0,
                2,
                3
            ],
            "timeLimit": 60
        }
    ]
};
const CreateQuizCard = ({createQuiz, getQuizzes}) => {
    const [quiz, setQuiz] = useState(sampleQuiz);
    const [ready, setReady] = useState(true);

    const handleChange = e => {
        let parsedQuiz = parseQuiz(e.json);
        if (!!parsedQuiz) {
            setQuiz(parsedQuiz);
            setReady(true)
        } else {
            setReady(false)
        }
    };

    const isProperQuiz = () => {

        let requiredFields = new Set(["name", "time", "questions"]);
        let requiredQuestionFields = new Set(["question", "answers", "correctAnswers", "timeLimit"]);

        if (!ready || !quiz || !Object.keys(quiz).length) {
            return false
        }

        for (let i = 0; i < requiredFields.length; i++) {
            if (!quiz.hasOwnProperty(requiredFields[i])) {
                return false
            }
        }

        for (let i = 0; i < quiz.questions.length; i++) {
            for (let j = 0; j < requiredQuestionFields.length; j++) {
                if (!quiz.questions[i].hasOwnProperty(requiredQuestionFields[j])) {
                    return false
                }
            }
        }

        return true

    };

    function parseQuiz(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return false
        }
    }

    function createAndUpdate() {
        createQuiz(quiz).then(() => {
            getQuizzes();
            setQuiz(sampleQuiz);
        })
    }

    return (
        <Modal
            trigger={
                <Button className={'l2w-secondary-button l2w-create-quiz-card'}>
                    <h2>Create Quiz</h2>
                </Button>
            }
        >
            <Modal.Header><h2>Quiz Creator</h2></Modal.Header>
            <div className={'l2w-json-input-comp'}>
                <JSONInput
                    id={uuid()}
                    placeholder={sampleQuiz}
                    locale={locale}
                    height='600px'
                    width='100%'
                    onChange={handleChange}
                />
            </div>
            <Modal.Actions className={'l2w-create-quiz-card-actions'}>
                <Grid>
                    <Grid.Column>
                        <Button disabled={!isProperQuiz()}
                                onClick={() => isProperQuiz() && createAndUpdate()}
                                primary>
                            Save Quiz</Button>
                    </Grid.Column>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

const stateToProperty = (state) => ({});

const propertyToDispatchMapper = (dispatch) => ({
    createQuiz: (quizObj) => createQuizAction(dispatch, quizObj),
    getQuizzes: () => getQuizzesAction(dispatch)
});

export default connect
(stateToProperty, propertyToDispatchMapper)
(CreateQuizCard)