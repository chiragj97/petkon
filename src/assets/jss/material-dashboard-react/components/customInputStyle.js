import { primaryColor, dangerColor, successColor } from "assets/jss/material-dashboard-react.js";

const customInputStyle = {
  labelRootError: {
    color: dangerColor[0],
  },
  labelRootSuccess: {
    color: successColor[0],
  },
  feedback: {
    position: "absolute",
    top: "18px",
    right: "0",
    zIndex: "2",
    display: "block",
    width: "24px",
    height: "24px",
    textAlign: "center",
    pointerEvents: "none",
  },

  formControl: {
    paddingBottom: "10px",
    margin: "27px 0 0 0",
    position: "relative",
    verticalAlign: "unset",
    color: "#0B2559 !important",
    fontFamily: "Poppins !important",
  },
};

export default customInputStyle;
