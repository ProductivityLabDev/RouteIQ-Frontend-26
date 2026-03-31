import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@material-tailwind/react";

export default function PositionedMenu({
  anchorEl,
  open,
  handleClose,
  selectedServiceTypes = [],
  selectedRepairTypes = [],
  onApply,
}) {
  const [serviceSelections, setServiceSelections] = React.useState(selectedServiceTypes);
  const [repairSelections, setRepairSelections] = React.useState(selectedRepairTypes);

  const serviceOptions = ["Type A", "Type B (Full)"];
  const repairOptions = ["Engine", "Brakes", "Axle", "Body", "Interior"];

  React.useEffect(() => {
    setServiceSelections(selectedServiceTypes);
  }, [selectedServiceTypes]);

  React.useEffect(() => {
    setRepairSelections(selectedRepairTypes);
  }, [selectedRepairTypes]);

  const handleToggle = (value, type) => {
    const updater = type === "service" ? setServiceSelections : setRepairSelections;
    const current = type === "service" ? serviceSelections : repairSelections;
    if (current.includes(value)) {
      updater(current.filter((item) => item !== value));
    } else {
      updater([...current, value]);
    }
  };

  const renderOptions = (options, type) => {
    const current = type === "service" ? serviceSelections : repairSelections;
    return options.map((option) => {
      return (
        <label key={option} className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-5 h-5 text-red-600 accent-red-600 align-middle"
            checked={current.includes(option)}
            onChange={() => handleToggle(option, type)}
          />
          <span>{option}</span>
        </label>
      );
    });
  };

  const handleApplyClick = () => {
    onApply?.({
      serviceTypes: serviceSelections,
      repairTypes: repairSelections,
    });
    handleClose();
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
          {renderOptions(serviceOptions, "service")}
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
          {renderOptions(repairOptions, "repair")}
        </div>
      </MenuItem>
      <MenuItem
        sx={{
          backgroundColor: "#efefef",
          justifyContent: "flex-end",
          paddingTop: "8px !important",
          paddingBottom: "8px !important",
        }}
      >
        <button
          type="button"
          onClick={handleApplyClick}
          className="rounded bg-[#C01824] px-4 py-2 text-xs font-semibold text-white"
        >
          Apply Filters
        </button>
      </MenuItem>
    </Menu>
  );
}
