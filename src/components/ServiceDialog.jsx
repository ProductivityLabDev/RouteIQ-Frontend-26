import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { menuItems } from "@/data/serviceFilterModalData";
import { Typography } from "@material-tailwind/react";

export default function PositionedMenu({ anchorEl, open, handleClose }) {
  const [checkedItems, setCheckedItems] = React.useState([0, 3]);

  const handleSelectItem = (index) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter((item) => item !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };
  return (
    <Menu
      id="demo-positioned-menu"
      aria-labelledby="demo-positioned-button"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        marginTop: 6,
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Typography className="text-start pt-2 ps-4 bg-[#efefef] font-bold text-[16px] text-black">
        Type of Service
      </Typography>
      {menuItems.map((item, index) => (
        <div key={index}>
          <MenuItem
            sx={{
              "&:hover": {
                backgroundColor: "#efefef",
              },
              backgroundColor: "#efefef",
              paddingTop: "0 !important",
              paddingBottom: "0 !important",
              "& .MuiMenu-list": {
                paddingTop: 0,
                paddingBottom: 0,
              },
            }}
          >
            <div className="flex flex-col space-y-4 pt-2 w-[220px]">
              <span className="font-extrabold text-[16px] text-black">
                {item.title}
              </span>
              {item.options.map((option, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-red-600 accent-red-600 align-middle"
                    checked={checkedItems.includes(
                      index * item.options.length + i
                    )}
                    onChange={() =>
                      handleSelectItem(index * item.options.length + i)
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </MenuItem>
        </div>
      ))}
    </Menu>
  );
}
