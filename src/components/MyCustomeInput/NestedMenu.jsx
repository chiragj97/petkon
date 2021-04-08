import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Menu, MenuItem, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ErrorMessage } from "@hookform/error-message";
import NestedMenuItem from "material-ui-nested-menu-item";
import Danger from "components/Typography/Danger";
// import Button from "components/CustomButtons/Button.js";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    width: "30%",
    // color: "#0B2559 !important",
    // fontFamily: "Poppins !important",
  },
})((props) => <Menu {...props} />);

export const NestedMenu = ({ label, name, isrequired, menu }) => {
  const [menuPosition, setMenuPosition] = useState(null);
  const { errors, control, setValue } = useFormContext();

  const handleClick = (event) => {
    setMenuPosition(event.currentTarget);
  };

  return (
    <Controller
      render={(props) => (
        <div style={{ marginBottom: "20px", marginTop: "20px" }} className="blue-text">
          <span>
            {label}
            {isrequired ? "*" : ""}
          </span>
          {/* <br /> */}
          <Button color="primary" variant="outlined" fullWidth onClick={handleClick}>
            {menu.find(({ value }) => value === props.value)
              ? menu.find(({ value }) => value === props.value).label
              : `Select ${label}`}
          </Button>
          <StyledMenu open={!!menuPosition} onClose={() => setMenuPosition(null)} anchorEl={menuPosition}>
            {menu.map(({ value, label, nestedmenu }) =>
              nestedmenu ? (
                <NestedMenuItem label={label} parentMenuOpen={!!menuPosition}>
                  {nestedmenu.map((item) => (
                    <MenuItem
                      onClick={() => {
                        setMenuPosition(null);
                        props.onChange(value);
                        setValue("subcategory", item);
                      }}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </NestedMenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    setMenuPosition(null);
                    props.onChange(value);
                  }}
                >
                  {label}
                </MenuItem>
              )
            )}
          </StyledMenu>
          <ErrorMessage render={({ message }) => <Danger>{message}</Danger>} errors={errors} name={name} />
        </div>
      )}
      name={name}
      control={control}
      rules={{ required: isrequired ? `${label} field is required` : false }}
    />
  );
};

export default NestedMenu;
