import React from 'react';
import "./QuizCardStyle.css"
import {Button, Card, Dropdown, DropdownItem, Grid} from "semantic-ui-react";
import {Link} from 'react-router-dom'
import {connect} from "react-redux";
import {deleteQuizAction} from "../../actions/QuizActions";
import Truncate from 'react-truncate';
import CreateQuizCard from "../quizManipulator/QuizManipulator";

const QuizCard = ({quiz, deleteQuiz}) => {

    return (
        <Card className={'l2w-quiz-card'} raised>
            <Card.Header className={'l2w-quiz-card-header'}>
                <Grid columns={2} centered>
                    <Grid.Column width={12}>
                        <h3>
                            <Truncate lines={1} ellipsis={<span>...</span>}>
                                {quiz.name}
                            </Truncate>
                        </h3>
                        <Card.Meta>
                            <Truncate lines={1} ellipsis={<span>...</span>}>
                                {quiz.questions.length > 1 ?
                                    <span>{quiz.questions.length} Questions</span>
                                    :
                                    <span>{quiz.questions.length} Question</span>
                                }
                            </Truncate>
                        </Card.Meta>
                    </Grid.Column>
                    <Grid.Column width={1}>
                        <Dropdown
                            pointing={'right'}
                            style={{background: 'none'}}
                            icon='ellipsis vertical'
                            floating
                            className={'l2w-quiz-edit-btn'}
                            button>
                            <Dropdown.Menu>
                                <CreateQuizCard
                                    initialState={quiz}
                                    triggerElement={
                                        <DropdownItem>
                                            Edit
                                        </DropdownItem>
                                    }
                                />
                                <DropdownItem onClick={() => deleteQuiz(quiz.id)}>
                                    Delete
                                </DropdownItem>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Grid.Column>
                </Grid>
            </Card.Header>
            <Card.Content className={'l2w-quiz-card-extra'} extra>
                <Grid columns={1}>
                    <Grid.Column>
                        <Button className={'l2w-secondary-button l2w-quiz-start-btn'} as={Link}
                                to={`/quiz/${quiz.id}`}>Start</Button>
                    </Grid.Column>
                </Grid>
            </Card.Content>
        </Card>

    );
};

const stateToProperty = (state) => ({});

const propertyToDispatchMapper = (dispatch) => ({
    deleteQuiz: (id) => deleteQuizAction(dispatch, id)
});

export default connect
(stateToProperty, propertyToDispatchMapper)
(QuizCard)