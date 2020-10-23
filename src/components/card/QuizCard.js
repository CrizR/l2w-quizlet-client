import React from 'react';
import "./QuizCardStyle.css"
import {Button, Card, Grid} from "semantic-ui-react";
import {Link} from 'react-router-dom'
import {connect} from "react-redux";
import {deleteQuizAction} from "../../actions/QuizActions";
import Truncate from 'react-truncate';

const QuizCard = ({quiz, deleteQuiz}) => {


    return (
        <Card className={'l2w-quiz-card'} raised>
            <Card.Header className={'l2w-quiz-card-header'}>
                <h3>
                    <Truncate lines={1} ellipsis={<span>...</span>}>
                        {quiz.name}
                    </Truncate>
                </h3>
                <Card.Meta>
                    <span>{quiz.questions.length} Questions</span>
                </Card.Meta>
            </Card.Header>
            <Card.Content className={'l2w-quiz-card-extra'} extra>
                <Grid columns={2}>
                    <Grid.Column>
                        <Button className={'l2w-secondary-button'} onClick={() => deleteQuiz(quiz.id)}>Delete</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button className={'l2w-secondary-button'} as={Link} to={`/quiz/${quiz.id}`}>Start</Button>
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