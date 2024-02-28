import React, { useState } from 'react'
import { Avatar, Typography, Menu, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/system';
import { getUserData } from '../Homepage/userMangement'; 
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { imageurl } from '../Homepage/Homepage';
import { image2url } from '../Homepage/Login';

const CustomAccordionDetails = styled(AccordionDetails)({
    position: 'absolute',
    top: '100px',
    zIndex: 2,
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.3)',
    overflowY: 'auto',
    maxHeight: '70vh',
    width: '70%',
    left: '50%',
    transform: 'translateX(-50%)',
});

const Navbar = () => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const userData = getUserData();
    const user = auth.currentUser;

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    let avatarContent;
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    if (user && user.providerData && user.providerData[0].providerId === 'google.com') {
        console.log('yess')
        // If the user signed in with Google, display their profile image
        if (imageurl != null) {
            avatarContent = <Avatar alt="Profile" src={imageurl} onClick={handleMenuClick} style={{ width: 70, height: 70 }} />;
        }
        else if (image2url != null) {
            avatarContent = <Avatar alt="Profile" src={image2url} onClick={handleMenuClick} style={{ width: 70, height: 70 }} />;
        }
    } else if (userData && userData.email) {
        // If the user signed in with email, display the first letter of their email as an avatar
        const firstLetter = userData.email.charAt(0).toUpperCase();
        avatarContent = <Avatar onClick={handleMenuClick} style={{ width: 70, height: 70 }}>{firstLetter}</Avatar>;
    }
    const handleLogout = () => {
        signOut(auth)
        navigate('/')
        return;
    };

    const open = Boolean(anchorEl);
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 15, justifyContent: 'space-between', background: 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.7))', }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Typography color='GrayText' style={{
                    fontFamily: 'Poppins, sans-serif', fontSize: '40px',
                    padding: '20px', fontWeight: 'bold'
                }}>DiseaseFree Areca</Typography>

                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <Accordion expanded={expanded} style={{ background: 'transparent' }}>
                        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                            <Typography color='GrayText' style={{
                                fontFamily: 'Poppins, sans-serif', fontSize: '20px',
                                fontWeight: 'bold'
                            }}>About Us</Typography>
                        </AccordionSummary>
                        <CustomAccordionDetails>
                            <Typography color='GrayText' style={{
                               
                            }}> This technology has been a game-changer for us. We can now detect diseases early and take timely actions, saving our crops and increasing yields.t</Typography>
                        </CustomAccordionDetails>
                    </Accordion>
                    {expanded ? (
                        <ExpandLessIcon
                            style={{ cursor: 'pointer', color: 'white' }}
                            onClick={handleExpandClick}
                        />
                    ) : (
                        <ExpandMoreIcon
                            style={{ cursor: 'pointer', color: 'white' }}
                            onClick={handleExpandClick}
                        />
                    )}
                </div>
            </div>
            {avatarContent}
            < Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div >
    )
}

export default Navbar;
