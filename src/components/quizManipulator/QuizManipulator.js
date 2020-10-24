import React, {useState} from 'react';
import "./QuizManipulatorStyle.css"
import {
    Button,
    Grid,
    Modal,
} from "semantic-ui-react";
import {connect} from "react-redux";
import {createQuizAction, getQuizzesAction, updateQuizAction} from "../../actions/QuizActions";
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
const QuizManipulator = ({createQuiz, updateQuiz, initialState, getQuizzes, triggerElement}) => {

    const id = initialState ? initialState.id : "";
    const [quiz, setQuiz] = useState(initialState ? removedId(initialState) : sampleQuiz);
    const [ready, setReady] = useState(true);
    const [open, setOpen] = React.useState(false);


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

    function isEdit() {
        return !!initialState;
    }

    function parseQuiz(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return false
        }
    }

    function removedId(s) {
        if (s.hasOwnProperty('id')) {
            let copy = JSON.parse(JSON.stringify(s));
            delete copy['id'];
            return copy
        } else {
            return s
        }
    }

    function createOrUpdate() {
        if (!!initialState) {
            updateQuiz(id, quiz)
        } else {
            createQuiz(quiz).then(() => {
                getQuizzes();
                setQuiz(sampleQuiz)
            })
        }
        setOpen(false);
    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={
                triggerElement
            }
        >
            <Modal.Header>
                {isEdit() ?
                    <h2>{initialState.name}</h2>
                    :
                    <h2>Quiz Creator</h2>
                }
            </Modal.Header>
            <div className={'l2w-json-input-comp'}>
                <JSONInput
                    id={uuid()}
                    placeholder={quiz}
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
                                onClick={() => isProperQuiz() && createOrUpdate()}
                                primary>
                            {isEdit() ?
                                <span>Update Quiz</span>
                                :
                                <span>Save Quiz</span>
                            }
                        </Button>
                    </Grid.Column>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

const stateToProperty = (state) => ({});

const propertyToDispatchMapper = (dispatch) => ({
    createQuiz: (quizObj) => createQuizAction(dispatch, quizObj),
    updateQuiz: (id, quizObj) => updateQuizAction(dispatch, id, quizObj),
    getQuizzes: () => getQuizzesAction(dispatch)
});

export default connect
(stateToProperty, propertyToDispatchMapper)
(QuizManipulator)