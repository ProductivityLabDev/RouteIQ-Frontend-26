import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { MdOutlineArrowOutward } from "react-icons/md";
import { MdOutlineHorizontalRule } from "react-icons/md";
import colors from "@/utlis/Colors";
import { TbMoneybag } from "react-icons/tb";
import { GrAttachment } from "react-icons/gr";
import { BsThreeDots } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

const ChatModal = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="chat-modal"
            aria-describedby="chat-modal-description"
        >
            <Box sx={{
                position: 'fixed',
                bottom: '80px',
                right: '30px',
                width: '400px',
                height: '67vh',
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: '10px',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#16494D', padding: 1, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
                    <Typography variant="h6" component="h2" color={colors.whiteColor} marginRight={7}>
                        Chat with us
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2, marginRight: 3 }}>
                        <MdOutlineArrowOutward size={20} onClick={onClose} color={colors.whiteColor} style={{ cursor: 'pointer', }} />
                        <MdOutlineHorizontalRule size={20} onClick={onClose} color={colors.whiteColor} style={{ cursor: 'pointer' }} />
                    </Box>
                </Box>
                {/*---------------------- user-header---------------------------------*/}
                <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: 1, flexDirection: 'row', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', gap: 2 }}>
                    <Box sx={{ backgroundColor: '#88929C', borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <TbMoneybag size={20} color={colors.whiteColor} style={{ cursor: 'pointer', }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'flex-end', }}>
                        <Typography color={colors.blackColor} fontWeight={'800'} >
                            Senior Consultan
                        </Typography>
                        <Typography color={colors.blackColor} >
                            Customer Support
                        </Typography>
                    </Box>
                </Box>
                {/* Messages Display */}
                <Box sx={{ flex: 1, overflowY: 'auto', padding: 2, height: "36vh" }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ backgroundColor: '#e0e0e0', padding: 1, borderRadius: '8px', alignSelf: 'flex-start' }}>
                            <Typography variant="body1" color={colors.blackColor}>
                                Hello, how can I assist you today?
                            </Typography>
                        </Box>
                        <Box sx={{ backgroundColor: '#d1e7ff', padding: 1, borderRadius: '8px', alignSelf: 'flex-end' }}>
                            <Typography variant="body1" color={colors.blackColor}>
                                I have a question about my account.
                            </Typography>
                        </Box>
                        <Box sx={{ backgroundColor: '#e0e0e0', padding: 1, borderRadius: '8px', alignSelf: 'flex-start' }}>
                            <Typography variant="body1" color={colors.blackColor}>
                                Sure, I'd be happy to help. What would you like to know?
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, flexDirection: 'column', width: '100%' }}>
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            placeholder="Type your message here..."
                            size="medium"
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{
                                borderWidth: '1px',
                                borderColor: 'lightgrey',
                                borderStyle: 'solid',
                                '& .MuiInputBase-root': {
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    padding: 1,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                width: '340px',
                                borderRadius: '8px'

                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '90%', justifyContent: 'flex-end', gap: 2 }}>
                        <GrAttachment size={20} color={colors.lightGrey} />
                        <BsThreeDots size={20} color={colors.lightGrey} />
                        <FiLogOut size={20} color={colors.lightGrey} />
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ChatModal;



{/* <ChatButton variant="contained" onClick={handleChatClick}>
<IoChatbubbleOutline size={25} color={colors.whiteColor} />
<Typography className="text-[23px] md:text-[12px] mt-5 ps-2" sx={{ fontWeight: 800 }}>Chat</Typography>
</ChatButton>
<ChatModal open={isChatOpen} onClose={handleCloseChat} /> */}

// const handleChatClick = () => {
//     setIsChatOpen(true);
//   };

//   const handleCloseChat = () => {
//     setIsChatOpen(false);
//   };
// import { Button, Grid, styled, Typography } from "@mui/material";
// const [isChatOpen, setIsChatOpen] = useState(false);

// import { IoChatbubbleOutline } from "react-icons/io5";
// import ChatModal from "@/components/ChatModal";


// const ChatButton = styled(Button)({
//   backgroundColor: colors?.redColor,
//   color: '#fff',
//   borderRadius: '20px',
//   width: '120px',
//   height: '45px',
//   position: 'fixed',
//   bottom: '20px',
//   right: '30px',
//   zIndex: 1000,
//   '&:hover': {
//     backgroundColor: colors?.redColor,
//   },
// });