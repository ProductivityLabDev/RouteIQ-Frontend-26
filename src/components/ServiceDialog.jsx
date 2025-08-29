import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@material-tailwind/react";

export default function PositionedMenu({ anchorEl, open, handleClose }) {
  const [checkedItems, setCheckedItems] = React.useState([]);

  const serviceOptions = ["Type A", "Type B (Full)"];
  const repairOptions = ["Engine", "Brakes", "Axle", "Body", "Interior"];

  const handleSelectItem = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const renderOptions = (options, startIndex) => {
    return options.map((option, i) => {
      const id = startIndex + i;
      return (
        <label key={id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-5 h-5 text-red-600 accent-red-600 align-middle"
            checked={checkedItems.includes(id)}
            onChange={() => handleSelectItem(id)}
          />
          <span>{option}</span>
        </label>
      );
    });
  };

  return (
    <Menu
      id="service-repair-menu"
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
      {/* SERVICE */}
      <Typography className="text-start pt-2 ps-4 bg-[#efefef] font-bold text-[16px] text-black">
        Service
      </Typography>
      <MenuItem
        sx={{
          backgroundColor: "#efefef",
          paddingTop: "0 !important",
          paddingBottom: "0 !important",
        }}
      >
        <div className="flex flex-col space-y-2 pt-2 w-[220px]">
          {renderOptions(serviceOptions, 0)}
        </div>
      </MenuItem>

      {/* REPAIR */}
      <Typography className="text-start pt-2 ps-4 bg-[#efefef] font-bold text-[16px] text-black">
        Repair
      </Typography>
      <MenuItem
        sx={{
          backgroundColor: "#efefef",
          paddingTop: "0 !important",
          paddingBottom: "0 !important",
        }}
      >
        <div className="flex flex-col space-y-2 pt-2 w-[220px]">
          {renderOptions(repairOptions, serviceOptions.length)}
        </div>
      </MenuItem>
    </Menu>
  );
}
