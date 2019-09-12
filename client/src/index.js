import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Link } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";

// core components
import AppLayout from "layouts/AppLayout.js";

import "assets/css/material-dashboard-react.css?v=1.8.0";

const hist = createBrowserHistory();

ReactDOM.render(
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
      <Route path="/app" component={AppLayout} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
