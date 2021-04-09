/*eslint-disable*/
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Collapse from '@material-ui/core/Collapse';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';

import styles from 'assets/jss/material-dashboard-react/components/sidebarStyle.js';

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const classes = useStyles();
  function activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }
  const { logo, logoText, routes } = props;

  const GetMenu = ({ prop }) => {
    const listItemClasses = classNames({
      [' ' + classes.activeItem]: activeRoute(props.mainPath + prop.path),
    });
    const whiteFontClasses = classNames({
      [' ' + classes.whiteFont]: activeRoute(props.mainPath + prop.path),
    });
    return (
      <NavLink
        to={props.mainPath + prop.path}
        className={classes.item}
        key={prop.name}
      >
        <ListItem button className={classes.itemLink + listItemClasses}>
          {typeof prop.icon === 'string' ? (
            <Icon className={classNames(classes.itemIcon, whiteFontClasses)}>
              {prop.icon}
            </Icon>
          ) : (
            <prop.icon
              className={classNames(classes.itemIcon, whiteFontClasses)}
            />
          )}
          <ListItemText
            primary={prop.name}
            className={classNames(classes.itemText, whiteFontClasses)}
            disableTypography={true}
          />
        </ListItem>
      </NavLink>
    );
  };

  const GetSubMenu = ({ prop }) => {
    const { subMenu } = prop;
    const isChildRoutes = subMenu.some(({ path }) =>
      activeRoute(props.mainPath + path)
    );
    const [open, setOpen] = React.useState(isChildRoutes);
    const handleClick = () => {
      setOpen(!open);
    };
    const whiteFontClasses = classNames({
      [' ' + classes.whiteFont]: isChildRoutes,
    });
    return (
      <div className={classes.item} activeClassName="active" key={prop.name}>
        <ListItem button className={classes.itemLink} onClick={handleClick}>
          {typeof prop.icon === 'string' ? (
            <Icon className={classNames(classes.itemIcon, whiteFontClasses)}>
              {prop.icon}
            </Icon>
          ) : (
            <prop.icon
              className={classNames(classes.itemIcon, whiteFontClasses)}
            />
          )}
          <ListItemText
            primary={prop.name}
            className={classNames(classes.itemText, whiteFontClasses)}
            disableTypography={true}
          />
          {open ? (
            <ExpandLess className={classNames(whiteFontClasses)} />
          ) : (
            <ExpandMore className={classNames(whiteFontClasses)} />
          )}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {subMenu.map(({ path, name }) => {
              const listItemClasses = classNames({
                [' ' + classes.activeItem]: activeRoute(props.mainPath + path),
              });
              return (
                <NavLink
                  to={props.mainPath + path}
                  className={classes.item}
                  key={name}
                >
                  <ListItem
                    button
                    className={classNames(
                      classes.itemLink + listItemClasses,
                      classes.nested
                    )}
                  >
                    <ListItemText
                      primary={name}
                      className={classNames(classes.itemText, whiteFontClasses)}
                      disableTypography={true}
                    />
                  </ListItem>
                </NavLink>
              );
            })}
          </List>
        </Collapse>
      </div>
    );
  };
  const links = (
    <List className={classes.list}>
      {routes.map((prop) => {
        const { subMenu } = prop;
        return subMenu?.length ? (
          <GetSubMenu prop={prop} />
        ) : (
          <GetMenu prop={prop} />
        );
      })}
    </List>
  );
  const brand = (
    <div className={classes.logo}>
      <a href="#" className={classNames(classes.logoLink)} target="_blank">
        <div className={classes.logoImage}>
          <img
            style={{ height: '8vh', top: '15%', width: '75%', left: '4vh' }}
            src={logo}
            alt="logo"
            className={classes.img}
          />
        </div>
      </a>
    </div>
  );
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={'right'}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={'left'}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  handleDrawerToggle: PropTypes.func,
  logo: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
  mainPath: PropTypes.string,
};
