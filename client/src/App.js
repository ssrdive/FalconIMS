import React, { useState } from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Link } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";

// Core components
import AppLayout from "layouts/AppLayout.js";
import Login from "views/Login/Login.js";

// Authentication imports
import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./context/auth";

import "assets/css/material-dashboard-react.css?v=1.8.0";

const hist = createBrowserHistory();

const App = (props) => {

    // eslint-disable-next-line
    const [authTokens, setAuthTokens] = useState();
    // eslint-disable-next-line
    const [loggedUser, setLoggedUser] = useState();

    const setTokens = (token, user) => {
        if (token === '-1') {
            localStorage.removeItem("tokens");
            localStorage.removeItem("user");
        } else {
            localStorage.setItem("tokens", JSON.stringify(token));
            localStorage.setItem("user", JSON.stringify(user));
            setAuthTokens(token);
            setLoggedUser(user);
        }
    }

    return (
        <AuthContext.Provider value={{
            authTokens: localStorage.getItem("tokens"),
            loggedUser: localStorage.getItem("user"),
            setAuthTokens: setTokens
        }}>
            <Router history={hist}>
                <Switch>
                    <Route exact path="/" render={() => {
                        return (
                            <div style={{
                                textAlign: 'center'
                            }}>
                                <h1>Falcon IMS</h1>
                                <p>SLIIT Academy 2nd Year 2nd Semester PPA Project</p>
                                <p><b>WEPPA15</b> &mdash; Falcon</p>
                                <p>
                                    <u>Technology Stack</u><br />
                                    Front End - <b><i>ReactJS</i></b><br />
                                    Back End (api.falconims.com) - <b><i>ExpressJS</i></b><br />
                                </p>
                                <Link to='/app'><Button type='button' color='info'>View App</Button></Link>
                            </div>
                        );
                    }} />
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute path="/app" component={AppLayout} />
                    <Route path="*" render={() => {
                        return (
                            <div style={{
                                textAlign: 'center'
                            }}>
                                <h1>404 Not Found</h1>
                                <p>Sorry! We can't seem to find that page</p>
                                <Link to='/'><Button type='button' color='info'>Home</Button></Link>
                            </div>
                        );
                    }} />
                </Switch>
            </Router></AuthContext.Provider>
    );
}

export default App;