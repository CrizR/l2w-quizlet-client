import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Icon} from "semantic-ui-react";
import {skipQuestionAction, submitAnswersAction, timeLimitReachedAction} from "../../actions/ExamActions";

function FlashcardComponent({currentQuestion, questionStartTime, quizStartTime, quizTime, isMasterTimer, submitAnswers, timeLimitReached}) {
    const [counter, setCounter] = useState(0);

    let questionTime = !!currentQuestion ? currentQuestion.timeLimit : 0;

    const getMasterTime = () => {
        return Math.max(quizTime - ((new Date() - quizStartTime) / 1000), 0);
    };

    const getQuestionTime = () => {
        return Math.max(questionTime - ((new Date() - questionStartTime) / 1000), 0)
    };

    function formatTime(duration) {
        let hrs = ~~(duration / 3600);
        let mins = ~~((duration % 3600) / 60);
        let secs = ~~duration % 60;
        let ret = "";
        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    function timeColor(time, max) {
        let percent = (Math.abs((time - max)) / max) * 100;
        if (percent > 75) {
            return '#D50F1C'
        } else if (percent > 50) {
            return '#F84200'
        } else {
            return '#12B259'
        }
    }

    const masterTime = getMasterTime();
    const masterColor = timeColor(masterTime, quizTime);

    const questionTimeLeft = getQuestionTime();
    const questionColor = timeColor(questionTimeLeft, questionTime);


    useEffect(() => {
        const interval = setInterval(() => {
            if (masterTime === 0) {
                timeLimitReached();
            } else if (questionTimeLeft === 0) {
                submitAnswers();
            }
            setCounter(counter => counter + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [masterTime, questionTimeLeft, submitAnswers, timeLimitReached]);

    return (
        <>
            {isMasterTimer ?
                <h3 style={{color: masterColor}}><Icon
                    style={{color: masterColor}}
                    name={'clock'}/>{formatTime(masterTime)}</h3>
                :
                <p style={{color: questionColor}}><Icon
                    style={{color: questionColor}}
                    name={'clock outline'}/>{formatTime(questionTimeLeft)}</p>
            }
        </>
    );
}

const stateToProperty = (state, props) => ({
    isMasterTimer: props.isMasterTimer,
    currentQuestion: state.ExamReducer.currentQuestion,
    questionStartTime: state.ExamReducer.questionStartTime,
    quizStartTime: state.ExamReducer.quizStartTime,
    quizTime: state.ExamReducer.quizTime
});


const propertyToDispatchMapper = (dispatch) => ({
    submitAnswers: () => submitAnswersAction(dispatch, []),
    skipQuestion: () => skipQuestionAction(dispatch),
    timeLimitReached: () => timeLimitReachedAction(dispatch),
});

export default connect
(stateToProperty, propertyToDispatchMapper)
(FlashcardComponent)