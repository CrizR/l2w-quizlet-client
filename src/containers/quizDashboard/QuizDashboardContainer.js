import React, {useEffect, useState} from 'react';
import "./QuizDashboardStyle.css"
import {Button, Container, Grid, Input, Loader, Menu} from "semantic-ui-react";
import QuizCard from "../../components/card/QuizCard";
import NavBarComponent from "../../components/navbar/NavBarComponent";
import {connect} from "react-redux";
import {getQuizzesAction, searchQuizzesAction} from "../../actions/QuizActions";
import CreateQuizCard from "../../components/quizManipulator/QuizManipulator";

const QuizDashboardContainer = ({getQuizzes, searchQuizzes, filtered}) => {

    useEffect(() => {
        getQuizzes()
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
    getQuizzes: () => getQuizzesAction(dispatch),
    searchQuizzes: (term) => searchQuizzesAction(dispatch, term)
});

export default connect
(stateToProperty, propertyToDispatchMapper)
(QuizDashboardContainer)