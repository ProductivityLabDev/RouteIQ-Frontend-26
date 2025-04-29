import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { closeicon } from '@/assets';
import { Button } from '@material-tailwind/react';

const MenuComponent = ({ anchorEl, open, handleClose, menuItems, infractionMenu }) => {
    return (
        <Menu
            id="custom-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'custom-button',
            }}
        >
            {infractionMenu && (
                <>
                    <Box display="flex" alignItems="center" justifyContent="space-between" px={2} pt={1}>
                        <Typography variant="subtitle1">Infraction</Typography>
                        <Button
                            className='p-1'
                            variant="text"
                            onClick={handleClose}
                        >
                            <img src={closeicon} className='w-[17px] h-[17px]' alt="" />
                        </Button>
                    </Box>
                </>
            )}
            {menuItems.map((item, index) => (
                <MenuItem key={index} onClick={(event) => {
                    if (item.onClick) item.onClick(event);
                    handleClose();
                }}
                className='gap-12'
                >
                    {infractionMenu ? (
                        <>
                            <Typography className='text-[23px] md:text-[32px] font-[700] text-[#000] mt-5'>{item.label}</Typography>
                            <Typography className='text-[23px] md:text-[32px] font-[700] text-[#000] mt-5 ps-2'>{item.value}</Typography>
                        </>
                    ) : (
                        item.label
                    )}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default MenuComponent;
