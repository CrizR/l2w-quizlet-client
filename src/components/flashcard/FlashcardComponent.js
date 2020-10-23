import React, {useState} from 'react';
import {connect} from "react-redux";
import {Button, Card, Grid, Menu} from "semantic-ui-react";
import "./FlashcardStyle.css"
import {skipQuestionAction, submitAnswersAction} from "../../actions/ExamActions";
import TimerComponent from "../timer/TimerComponent";

function FlashcardComponent({currentQuestion, submitAnswers, skipQuestion}) {
    const [selectedAnswers, selectAnswer] = useState(new Set());

    const toggleAnswer = (answer) => {
        let answers = new Set(selectedAnswers);
        if (selectedAnswers.has(answer)) {
            answers.delete(answer);
        } else {
            answers.add(answer)
        }
        selectAnswer(answers);
    };

    const clearAnswers = () => {
        selectAnswer(new Set())
    };

    const isAnswered = () => {
        return selectedAnswers.size > 0
    };

    const isActiveAnswer = (answer) => {
        return selectedAnswers.has(answer)
    };


    return (
        <>
            {!!currentQuestion &&
            <Card className={'l2w-flashcard'} raised>
                <Card.Header className={'l2w-flashcard-header'}>
                    <Grid columns={2}>
                        <Grid.Column style={{textAlign: 'left'}} width={13}>
                            <h2>{currentQuestion.question}</h2>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            {!!currentQuestion && <TimerComponent isMasterTimer={false}/>}
                        </Grid.Column>
                    </Grid>
                </Card.Header>
                <Card.Content className={'l2w-flashcard-content'}>
                    <Menu vertical className={'l2w-flashcard-answers'}>
                        {!!currentQuestion.answers && currentQuestion.answers.map((answer, i) => (
                            <Menu.Item key={i} onClick={() => toggleAnswer(i)}
                                       active={isActiveAnswer(i)}>
                                <p className={'l2w-flashcard-answer'}><span
                                    className={'l2w-flashcard-answer-number'}>{i + 1}.</span>{answer}</p>
                            </Menu.Item>
                        ))}
                    </Menu>
                </Card.Content>
                <Card.Content className={'l2w-flashcard-extra'} extra>
                    <Grid columns={2}>
                        <Grid.Column>
                            <Button onClick={() => skipQuestion() && clearAnswers()}
                                    className={'l2w-secondary-button'}>SKIP</Button>
                        </Grid.Column>

                        <Grid.Column>
                            <Button
                                onClick={() => isAnswered() ? submitAnswers(selectedAnswers)
                                    && clearAnswers() : void (0)}
                                disabled={!isAnswered()}
                                className={'l2w-primary-button'}>NEXT</Button>
                        </Grid.Column>
                    </Grid>
                </Card.Content>
            </Card>
            }
        </>
    );
}

const stateToProperty = (state) => ({
    currentQuestion: state.ExamReducer.currentQuestion,
});


const propertyToDispatchMapper = (dispatch) => ({
    submitAnswers: (selectedAnswers) => submitAnswersAction(dispatch, selectedAnswers),
    skipQuestion: () => skipQuestionAction(dispatch),
});

export default connect
(stateToProperty, propertyToDispatchMapper)
(FlashcardComponent)