import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import {combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import ExamContainer from "./containers/examContainer/ExamContainer";
import ExamReducer from "./reducers/ExamReducer";
import {useAuth0} from "@auth0/auth0-react";
import QuizReducer from "./reducers/QuizReducer";
import ProtectedRoute from "./auth/ProtectedRoute";
import {Loader} from "semantic-ui-react";
import QuizDashboardContainer from "./containers/quizDashboard/QuizDashboardContainer";
import LoadingComponent from "./components/loading/LoadingComponent";


const rootReducer = combineReducers({
    QuizReducer,
    ExamReducer,
});

const store = createStore(
    rootReducer,
);


function App() {
    const {isLoading} = useAuth0();

    if (true) {
        return <LoadingComponent/>
    }

    return (
        <div className="App ap">
            <Provider store={store}>
                <Router>
                    <ProtectedRoute path="/" exact component={QuizDashboardContainer}/>
                    <ProtectedRoute path='/quiz/:id'
                                    component={(routerProps) => <ExamContainer id={routerProps.match.params.id}/>}/>
                </Router>
            </Provider>
        </div>
    );
}

export default App;