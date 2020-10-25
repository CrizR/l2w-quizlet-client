import React, {useEffect} from 'react';
import "./QuizDashboardStyle.css"
import {Button, Container, Grid, Input, Menu} from "semantic-ui-react";
import QuizCard from "../../components/card/QuizCard";
import NavBarComponent from "../../components/navbar/NavBarComponent";
import {connect} from "react-redux";
import {getQuizzesAction, searchQuizzesAction} from "../../actions/QuizActions";
import CreateQuizCard from "../../components/quizManipulator/QuizManipulator";
import {useAuth0} from "@auth0/auth0-react";
import config from "../../auth/auth_config"

const QuizDashboardContainer = ({getQuizzes, searchQuizzes, filtered}) => {
    const {getAccessTokenSilently, user} = useAuth0();

    useEffect(() => {
        getAccessTokenSilently({
            audience: config.AUTH_AUDIENCE,
        }).then((token) => {
            getQuizzes(user, token)
        });
    }, []);


    return (
        <>
            <NavBarComponent/>
            <div className={'l2w-quiz-dashboard'}>
                <Container>
                    <Menu secondary className={'l2w-quiz-menu'}>
                        <Menu.Item className="l2w-quiz-dashboard-menu-item">
                            <h2>Your Quizzes</h2>
                        </Menu.Item>
                        <Menu.Item
                            className="aligned">
                            <Input onChange={(e) => searchQuizzes(e.target.value)} icon={'search'}
                                   placeholder='Search...'/>
                        </Menu.Item>
                    </Menu>
                    <Grid stackable>
                        {filtered.map((quiz, i) =>
                            <Grid.Column key={i} width={4}>
                                <QuizCard quiz={quiz}/>
                            </Grid.Column>
                        )}
                        <Grid.Column key={"add-quiz-id"} width={4}>
                            <CreateQuizCard
                                triggerElement={<Button className={'l2w-secondary-button l2w-create-quiz-card'}>
                                    <h2>Create Quiz</h2>
                                </Button>}/>
                        </Grid.Column>
                    </Grid>
                </Container>
            </div>
        </>
    );

};

const stateToProperty = (state) => ({
    filtered: state.QuizReducer.filtered
});

const propertyToDispatchMapper = (dispatch) => ({
    getQuizzes: (user, token) => getQuizzesAction(dispatch, user, token),
    searchQuizzes: (term) => searchQuizzesAction(dispatch, term)
});

export default connect
(stateToProperty, propertyToDispatchMapper)
(QuizDashboardContainer)