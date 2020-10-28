import React, {useEffect, useState} from 'react';
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
import {useAuth0} from "@auth0/auth0-react";
import useEventListener from '@use-it/event-listener'

const REQUIRED_MAIN_FIELDS = ["name", "time", "questions"];
const REQUIRED_QUESTION_FIELDS = ["question", "answers", "correctAnswers", "timeLimit"];
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
        },
        {
            "question": "What is true about a square?",
            "answers": [
                "All sides have equal length.",
                "It only has 3 sides",
            ],
            "correctAnswers": [
                0
            ],
            "timeLimit": 60
        },
        {
            "question": "What is true about a triangle?",
            "answers": [
                "It only has 3 sides",
                "It's pointy"
            ],
            "correctAnswers": [
                0,1
            ],
            "timeLimit": 60
        }
    ]
};

const QuizManipulator = ({createQuiz, updateQuiz, selectedQuiz, getQuizzes, triggerElement, isEdit}) => {


    const [quiz, setQuiz] = useState({});
    const [ready, setReady] = useState(true);
    const [open, setOpen] = React.useState(false);
    const {getAccessTokenSilently, user} = useAuth0();
    const [token, setToken] = useState(undefined);

    function handler({key}) {
        setReady(false)
    }

    useEventListener('keydown', handler);

    useEffect(() => {
        getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH_AUDIENCE,
        }).then((token) => {
            setToken(token)
        });
    }, []);


    useEffect(() => {
        setQuiz(isEdit ? setupQuizObject(selectedQuiz) : sampleQuiz)
    }, [selectedQuiz]);


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

        let requiredFields = new Set(REQUIRED_MAIN_FIELDS);
        let requiredQuestionFields = new Set(REQUIRED_QUESTION_FIELDS);

        if (!ready || !quiz || !Object.keys(quiz).length || !quiz.questions || !Object.keys(quiz.questions).length) {
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

    function setupQuizObject(s) {
        if (s.hasOwnProperty('id')) {
            let copy = JSON.parse(JSON.stringify(s));
            delete copy['id'];
            return copy
        } else {
            return s
        }
    }

    function createOrUpdate() {
        if (isEdit) {
            updateQuiz(user, selectedQuiz.id, quiz, token)
        } else {
            createQuiz(user, quiz, token).then(() => {
                getQuizzes(user, token);
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
                {isEdit ?
                    <h2>{quiz.name}</h2>
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
                    waitAfterKeyPress={2000}
                    onChange={handleChange}
                />
            </div>
            <Modal.Actions className={'l2w-create-quiz-card-actions'}>
                <Grid>
                    <Grid.Column>
                        <Button disabled={!isProperQuiz()}
                                onClick={() => isProperQuiz() && createOrUpdate()}
                                primary>
                            {isEdit ?
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

const stateToProperty = (state) => ({
    selectedQuiz: state.QuizReducer.selected
});

const propertyToDispatchMapper = (dispatch) => ({
    createQuiz: (user, quizObj, token) => createQuizAction(dispatch, user, quizObj, token),
    updateQuiz: (user, id, quizObj, token) => updateQuizAction(dispatch, user, id, quizObj, token),
    getQuizzes: (user, token) => getQuizzesAction(dispatch, user, token)
});

export default connect
(stateToProperty, propertyToDispatchMapper)
(QuizManipulator)