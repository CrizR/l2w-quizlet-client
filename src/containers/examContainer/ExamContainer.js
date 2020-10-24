import React, {useEffect} from 'react';
import {connect} from "react-redux";
import FlashcardComponent from "../../components/flashcard/FlashcardComponent";
import {Button, Card, Container, Grid, Icon, Progress} from "semantic-ui-react";
import NavBarComponent from "../../components/navbar/NavBarComponent";
import "./ExamStyle.css"
import {initializeExamAction, redoExamAction} from "../../actions/ExamActions";
import TimerComponent from "../../components/timer/TimerComponent";
import {Link} from "react-router-dom";
import Truncate from "react-truncate";

function ExamContainer({
                           quizName, questionsFinished, isExamEnded, totalQuestions, timeLimitReached,
                           score, maxScore, redoExam, initializeExam, id
                       }) {

    useEffect(() => initializeExam(id), [initializeExam, id]);

    const getPercentComplete = function () {
        return ((totalQuestions - (totalQuestions - questionsFinished)) / totalQuestions) * 100
    };

    return (
        <div className={'l2w-exam-container'}>
            <NavBarComponent/>
            <div className={'l2w-progress-container'}>
                <Progress className={'l2w-progress-bar'}
                          percent={getPercentComplete()} indicating/>
            </div>

            <Container>
                <div className={'l2w-quiz-container'}>
                    <Grid className={'l2w-quiz-header'} columns={2}>
                        <Grid.Column>
                            <h3>
                                <Icon name={'clipboard'}/>
                                <Truncate lines={1} ellipsis={<span>...</span>}>
                                    {quizName}
                                </Truncate>
                            </h3>
                        </Grid.Column>

                        <Grid.Column>
                            {!isExamEnded && <TimerComponent isMasterTimer={true}/>}
                        </Grid.Column>
                    </Grid>

                    {!isExamEnded ?
                        <div>
                            <Grid centered>
                                <Grid.Row className={'l2w-flashcard-container'}>
                                    <FlashcardComponent/>
                                </Grid.Row>
                            </Grid>
                        </div>

                        :
                        <Grid centered>
                            <Grid.Row>
                                <Card className={'l2w-score-board'}>
                                    <Card.Header className={'l2w-score-board-header'}>
                                        {!!timeLimitReached ?
                                            <h2>You ran out of time!</h2>
                                            :
                                            <h2>Congrats you've finished the quiz!</h2>
                                        }
                                    </Card.Header>

                                    <Card.Content className={'l2w-score-board-content'}>
                                        <h1><Icon name={'line graph'}/>Score: {Math.ceil(score)}</h1>

                                        <h4>Max Score: {Math.ceil(maxScore)}</h4>

                                    </Card.Content>

                                    <Card.Content className={'l2w-score-board-extra'} extra>
                                        <Button as={Link} to={"/"}
                                                className={'l2w-primary-button'}>Home</Button>
                                        <Button onClick={() => redoExam()}
                                                className={'l2w-primary-button'}>Retry</Button>
                                    </Card.Content>
                                </Card>
                            </Grid.Row>
                        </Grid>
                    }
                </div>

            </Container>
        </div>
    );
}


function stateToProperty(state) {
    return {
        quizName: state.ExamReducer.quizName,
        questionsFinished: state.ExamReducer.questionsFinished,
        isExamEnded: state.ExamReducer.isExamEnded,
        currentQuestion: state.ExamReducer.currentQuestion,
        totalQuestions: state.ExamReducer.totalQuestions,
        quizTime: state.ExamReducer.quizTime,
        score: state.ExamReducer.score,
        timeLimitReached: state.ExamReducer.timeLimitReached,
        maxScore: state.ExamReducer.maxScore,
    }
}

function propertyToDispatchMapper(dispatch) {
    return {
        redoExam: () => redoExamAction(dispatch),
        initializeExam: (id) => initializeExamAction(dispatch, id)
    }

}

export default connect
(stateToProperty, propertyToDispatchMapper)
(ExamContainer)