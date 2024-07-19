import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import colors from "../../utlis/Colors";
import assets from "../../utlis/assets";

const InputField = ({
  type,
  value,
  onChange,
  label,
  placeholder,
  isPassword,
  showPassword,
  handleClickShowPassword,
  min,
  showPassword1,
  handleClickShowConfirmPassword,
  sx,
  isSearch,
}) => {
  return (
    <TextField
      fullWidth
      autoFocus
      type={type}
      value={value}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      variant="outlined"
      InputProps={{
        startAdornment: isSearch && (
          <InputAdornment position="start">
            <IconButton
              edge="start"
              sx={{
                p: 0,
                paddingInline:1
              }}
            >
              <img src={assets?.search} />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: isPassword && (
          <InputAdornment position="end">
            <IconButton
              onClick={
                handleClickShowPassword || handleClickShowConfirmPassword
              }
              sx={{
                color: "rgba(20, 21, 22, 1)",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              {showPassword || showPassword1 ? (
                <img src={assets?.eyeclosed} />
              ) : (
                <img src={assets?.eyeopen} />
              )}
            </IconButton>
          </InputAdornment>
        ),
        inputProps: {
          min: min,
        },
      }}
      sx={{
        "& fieldset": {
          borderColor: "#fff !important",
          borderRadius: 2,
        },
        backgroundColor: colors?.whiteColor,
        borderRadius: 2,
        ...sx,
      }}
    />
  );
};

export default InputField;
