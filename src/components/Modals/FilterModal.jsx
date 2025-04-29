import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel } from "@mui/material";
export const FilterModal = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Filters</DialogTitle>
            <DialogContent>
                <div className="space-y-3">
                    <label className="text-gray-600 font-semibold">Mileage at time of service</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded-md"
                        placeholder="Mileage at time of service"
                    />

                    <div className="font-bold mt-4">Type of Service</div>

                    <div className="ml-2">
                        <div className="font-semibold">Service A</div>
                        <FormControlLabel control={<Checkbox sx={{ color: "#C01824", '&.Mui-checked': { color: "#C01824" } }} />} label="Air Compressor" />
                        <FormControlLabel control={<Checkbox sx={{ color: "#C01824", '&.Mui-checked': { color: "#C01824" } }} />} label="Brakes" />
                        <FormControlLabel control={<Checkbox sx={{ color: "#C01824", '&.Mui-checked': { color: "#C01824" } }} />} label="Lube" />
                    </div>

                    <div className="ml-2">
                        <div className="font-semibold">Service B</div>
                        <FormControlLabel control={<Checkbox sx={{ color: "#C01824", '&.Mui-checked': { color: "#C01824" } }} />} label="Full Service" />
                        <FormControlLabel control={<Checkbox sx={{ color: "#C01824", '&.Mui-checked': { color: "#C01824" } }} />} label="Oil Change" />
                        <FormControlLabel control={<Checkbox sx={{ color: "#C01824", '&.Mui-checked': { color: "#C01824" } }} />} label="Other" />
                    </div>
                </div>
            </DialogContent>

            <Button 
            onClick={onClose}
            sx={{
                backgroundColor: "#C01824",
                width: "35%",
                color: "white",
                paddingX: 6,
                marginY: 2,
                marginInline: 4,
                "&:hover": { backgroundColor: "#A01520" }
            }}>
                Sumbit
            </Button>
        </Dialog>
    );
};