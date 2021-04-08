import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import styles from "assets/jss/material-dashboard-react/components/customInputStyle.js";

const style = {
  root: {
    "& .MuiInputBase-root": {
      color: "#0B2559 !important",
      fontFamily: "Poppins !important",
    },
    "& .MuiFormLabel-root": {
      color: "#0B2559 !important",
      fontFamily: "Poppins !important",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "1px solid #0B2559 !important",
    },
  },
};
const CssTextField = withStyles(style)(TextField);
const CssTKeyboardDatePicker = withStyles(style)(KeyboardDatePicker);
const CssTSelect = withStyles(style)(FormControl);

const useStyles = makeStyles(styles);
function CustomInput(props) {
  const classes = useStyles();
  const { type, formControlProps, labelText, id, inputProps, error, success, fullWidth } = props;

  return (
    <FormControl
      fullWidth={fullWidth}
      {...props.formControlProps}
      className={formControlProps.className + " " + classes.formControl}
    >
      {type === "date" ? (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <CssTKeyboardDatePicker format="MM/dd/yyyy" margin="normal" {...inputProps} />
        </MuiPickersUtilsProvider>
      ) : type === "select" ? (
        <CssTSelect margin="normal" fullWidth>
          <InputLabel>{labelText}</InputLabel>
          <Select value={inputProps.value} onChange={inputProps.onChange} label={labelText}>
            {inputProps.options.map((item) => (
              <MenuItem value={item.value}>{item.label}</MenuItem>
            ))}
          </Select>
        </CssTSelect>
      ) : (
        <CssTextField id={id} color="primary" label={labelText} fullWidth={true} {...inputProps} />
      )}

      {error ? (
        <Clear className={classes.feedback + " " + classes.labelRootError} />
      ) : success ? (
        <Check className={classes.feedback + " " + classes.labelRootSuccess} />
      ) : null}
    </FormControl>
  );
}

CustomInput.propTypes = {
  labelText: PropTypes.node,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
  type: PropTypes.string,
};

CustomInput.defaultProps = {
  formControlProps: {},
  fullWidth: true,
};

export default CustomInput;
