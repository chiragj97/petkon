import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { MuiThemeProvider } from "@material-ui/core/styles";

import store from "store/";
import Admin from "layouts/Admin";
import Login from "./views/public/Login";
import Singup from "./views/public/Singup";
import ForgotPassword from "./views/public/ForgotPassword";
import VerifyPassword from "./views/public/VerifyPassword";

import "assets/css/material-dashboard-react.css?v=1.9.0";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { getLoginDetails } from "ApiService";
import { getMuiTheme } from "assets/jss/material-dashboard-react";

const hist = createBrowserHistory();

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem("token") ? (
        <Component role={getLoginDetails().role} {...props} />
      ) : (
        <Redirect to={{ pathname: "/app/login", state: { from: props.location } }} />
      )
    }
  />
);

ReactDOM.render(
  <MuiThemeProvider theme={getMuiTheme()}>
    <Provider store={store}>
      <Router history={hist}>
        <Switch>
          <Route path="/app/login" component={Login} />
          <Route path="/app/Singup" component={Singup} />
          <Route path="/app/ForgotPassword" component={ForgotPassword} />
          <Route path="/app/VerifyPassword" component={VerifyPassword} />

          <ProtectedRoute path="/app" component={Admin} />
          <Redirect from="/" to="/app" />
        </Switch>
      </Router>
      <ToastContainer hideProgressBar={true} autoClose={3000} />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
