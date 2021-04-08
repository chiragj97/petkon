import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
// import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import logo from "assets/img/logo.png";
import "perfect-scrollbar/css/perfect-scrollbar.css";

let ps;

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  // styles
  const classes = useStyles();
  const mainPanel = React.createRef();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/app/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  const switchRoutes = (
    <Switch>
      {routes
        .filter(({ role }) => role === rest.role)
        .map((prop, key) =>
          prop.subMenu?.length ? (
            prop.subMenu.map((item) => (
              <Route path={rest.match.path + item.path} component={item.component} key={key} />
            ))
          ) : (
            <Route path={rest.match.path + prop.path} component={prop.component} key={key} />
          )
        )}
      <Redirect from={rest.match.path} to={`${rest.match.path}/dashboard`} />
    </Switch>
  );

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes.filter(({ showInSide, role }) => showInSide && role === rest.role)}
        logoText={""}
        logo={logo}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        mainPath={rest.match.path}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes.filter(({ role }) => role === rest.role)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes}</div>
        )}
        {/* {getRoute() ? <Footer /> : null} */}
      </div>
    </div>
  );
}
