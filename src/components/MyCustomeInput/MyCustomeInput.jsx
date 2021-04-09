import React from "react";
import Select from "react-select";
import { useFormContext, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import TextField from "@material-ui/core/TextField";
import Danger from "components/Typography/Danger";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withStyles } from "@material-ui/core/styles";

const CssTextField = withStyles({
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
})(TextField);

const MyCustomeInput = ({
  label,
  name,
  placeholder,
  type,
  option,
  isrequired,
  disabled,
  isSearchable,
  isAutocomplete,
  accept,
  rules,
  isPreview,
}) => {
  const { register, errors, control } = useFormContext();

  switch (type) {
    case "select":
      return (
        <div>
          {/* <span>
            {label}
            {isrequired ? "*" : ""}
          </span> */}
          {isAutocomplete ? (
            <Controller
              render={(props) => (
                <Autocomplete
                  {...props}
                  freeSolo
                  options={option}
                  getOptionLabel={({ label }) => label}
                  inputValue={props.value ? props.value : "N/A"}
                  renderInput={(params) => (
                    <CssTextField
                      {...params}
                      label={label}
                      fullWidth={true}
                      onChange={(e) => props.onChange(e.target.value)}
                      margin="normal"
                      // variant="outlined"
                    />
                  )}
                  onChange={(_, data) => props.onChange(data.value)}
                  disabled={disabled}
                  placeholder={placeholder ? placeholder : `Enter ${label}`}
                  InputLabelProps={{
                    className: isrequired ? "required-label" : "",
                    required: isrequired || false,
                    shrink: true,
                  }}
                  error={errors[name]}
                />
              )}
              name={name}
              control={control}
              rules={{ required: isrequired ? `${label} field is required` : false }}
            />
          ) : (
            <Controller
              name={name}
              control={control}
              rules={{ required: isrequired ? `${label} field is required` : false }}
              render={(props) => (
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 9999 }),
                  }}
                  placeholder={placeholder ? placeholder : `Enter ${label}  ${isrequired ? "*" : ""}`}
                  options={option}
                  isSearchable={isSearchable}
                  isClearable
                  onChange={({ value }) => props.onChange(value)}
                  value={option.find(({ value }) => value === props.value)}
                />
              )}
            />
          )}
          <ErrorMessage render={({ message }) => <Danger>{message}</Danger>} errors={errors} name={name} />
        </div>
      );
    case "file":
      return (
        <div>
          {isPreview ? (
            <div
              style={{
                marginTop: "-75px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <img
                style={{ height: "120px", width: "120px", objectFit: "contain" }}
                src={isPreview ? isPreview : "https://i.imgur.com/sZ64r9p.png"}
              />
              <label style={{cursor:'pointer'}} className="custom-file-upload" htmlFor="file-upload">
                {label}
              </label>
              <input
                name={name}
                disabled={disabled}
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                accept={accept}
                ref={register({
                  required: isrequired ? `${label} field is required` : false,
                })}
              />
            </div>
          ) : (
            <CssTextField
              color="primary"
              label={label}
              type="file"
              name={name}
              margin="normal"
              // variant="outlined"
              fullWidth={true}
              error={errors[name]}
              placeholder={placeholder ? placeholder : `Enter ${label}`}
              disabled={disabled}
              InputLabelProps={{
                className: isrequired ? "required-label" : "",
                required: isrequired || false,
                shrink: true,
              }}
              inputRef={register({
                required: isrequired ? `${label} field is required` : false,
              })}
              inputProps={{ accept: accept }}
            />
          )}
          <ErrorMessage render={({ message }) => <Danger>{message}</Danger>} errors={errors} name={name} />
        </div>
      );
    default:
      return (
        <div>
          <Controller
            as={
              <CssTextField
                color="primary"
                label={label}
                type={type ? type : "text"}
                margin="normal"
                // variant="outlined"
                fullWidth={true}
                error={errors[name]}
                placeholder={placeholder ? placeholder : `Enter ${label}`}
                disabled={disabled}
                InputLabelProps={{
                  className: isrequired ? "required-label" : "",
                  required: isrequired || false,
                  ...(type === "date" && { shrink: true }),
                }}
              />
            }
            control={control}
            name={name}
            defaultValue={type === "date" ? new Date() : ""}
            rules={{
              required: isrequired ? `${label} field is required` : false,
              ...rules,
            }}
          />
          <ErrorMessage render={({ message }) => <Danger>{message}</Danger>} errors={errors} name={name} />
        </div>
      );
  }
};

export default MyCustomeInput;
