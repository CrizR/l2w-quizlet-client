import React, {useEffect} from 'react';
import "./QuizDashboardStyle.css"
import {Container, Grid, Icon, Loader, Menu} from "semantic-ui-react";
import QuizCard from "../../components/card/QuizCard";
import NavBarComponent from "../../components/navbar/NavBarComponent";
import {connect} from "react-redux";
import {getQuizzesAction} from "../../actions/QuizActions";
import CreateQuizCard from "../../components/createQuizComponent/CreateQuizCard";

const QuizDashboardContainer = ({getQuizzes, quizzes}) => {

    useEffect(getQuizzes, []);

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
                            <h4 style={{margin: 0}}>Name</h4>
                            <Icon className="wbdv-header wbdv-sort" name={'sort'}/>
                        </Menu.Item>
                    </Menu>
                    <Grid stackable>
                        {!!quizzes ?
                            <>
                                {quizzes.map((quiz, i) =>
                                    <Grid.Column key={i} width={4}>
                                        <QuizCard quiz={quiz}/>
                                    </Grid.Column>
                                )}
                                <Grid.Column key={"add-quiz-id"} width={4}>
                                    <CreateQuizCard/>
                                </Grid.Column>
                            </>
                            :
                            <>
                                <Loader inline/>
                            </>
                        }
                    </Grid>
                </Container>
            </div>
        </>
    );

};

const stateToProperty = (state) => ({
    quizzes: state.QuizReducer.quizzes
});

const propertyToDispatchMapper = (dispatch) => ({
    getQuizzes: () => getQuizzesAction(dispatch)
});

export default connect
(stateToProperty, propertyToDispatchMapper)
(QuizDashboardContainer)