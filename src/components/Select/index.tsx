import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import MuiSelect from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  // disablePortal: true,
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      // backgroundColor: "#232B2BCC",
      border: "1px solid #FFFFFF1A",
      color: "#000",
    },
  },
};

export default function Select({
  options = [],
  placeholder,
  onChange,
  name,
  ...props
}: {
  options: any;
  placeholder: string;
  onChange: any;
  name: any;
}) {
  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    if (name) {
      onChange({ target: { name, value } });
    } else {
      onChange(value);
    }
    // setPersonName(
    //   // On autofill we get a stringified value.
    //   typeof value === "string" ? value.split(",") : value
    // );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: "100%", mt: 3 }} className="!m-0">
        <MuiSelect
          {...props}
          sx={{
            height: "42px",
            borderRadius: "12px",
            backgroundColor: "#FFFFFF0D",
            border: "1px solid #FFFFFF1A",
            "&": {
              fontSize: "14px",
              color: "white",
              fontFamily: "RobotoMono",
              borderRadius: "12px", // Custom border radius
              "& fieldset": {
                borderColor: "#FFFFFF1A !important", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "#09FFF0 !important", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#09FFF0 !important", // Border color on focus
              },
            },
          }}
          displayEmpty
          // value={personName}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected: any) => {
            if (!selected) {
              return <em className="text-gray-500">{placeholder}</em>;
            }

            return options.find((item) => item.name === selected)?.label;
          }}
          MenuProps={MenuProps}
          inputProps={{ "aria-label": "Without label" }}
        >
          {/* <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem> */}
          {options.map((opt) => (
            <MenuItem
              sx={{
                height: "42px",
                "&:hover": {
                  bgcolor: "#232B2B80",
                },
                "&.Mui-selected": {
                  //   bgcolor: "#232B2B80",
                  color: "#09FFF0",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "#232B2B80",
                },
              }}
              key={opt.name}
              value={opt.name}
              //   style={getStyles(opt.name, personName, theme)}
            >
              {opt.label}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    </div>
  );
}
