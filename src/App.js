import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import {combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import ExamContainer from "./containers/examContainer/ExamContainer";
import ExamReducer from "./reducers/ExamReducer";
import QuizDashboard from "./containers/quizDashboard/QuizDashboardContainer";
import QuizReducer from "./reducers/QuizReducer";


const rootReducer = combineReducers({
    QuizReducer,
    ExamReducer,
});

const store = createStore(
    rootReducer,
);

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div className="App ap">
                    <Route path="/" exact component={QuizDashboard}/>
                    <Route path='/quiz/:id'
                           component={(routerProps) => <ExamContainer id={routerProps.match.params.id}/>}/>
                </div>
            </Router>
        </Provider>
    );
}

export default App;