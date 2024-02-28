import React, { useState, useEffect } from 'react'
import { styled } from '@mui/system';
import { TextField, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button'
import Input from '@mui/material/Input';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth,db } from '../../firebase';
import { ref, get } from 'firebase/database';
import { setUserData,setUserDetails,setUserPresent } from './userMangement';
import image1url from '../image/image';

const MainContainer = styled('div')({
    height: "100vh",
    display: 'flex',
    backgroundColor: 'black',
});
const FirstHalf = styled('div')({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: 'black',
    justifyContent: 'flex-start',
    textAlign: 'start',
    padding: 15,
});
const SecondHalf = styled('div')({
    flex: 1,
    padding: 15,
});
const GenerateButton = styled('button')({
    marginTop: '15px',
    backgroundColor: 'black',
    padding: '10px 26px',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 500,
    color: 'white',
    height: '50px',
    borderRadius: '10px',
    fontSize: '16px',
    "&:hover": {
        background: 'white',
        color: 'black'
    },
});

const TypingEffect = ({ text, speed }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText((prevText) => prevText + text[currentIndex]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [currentIndex, text, speed]);

    return (
        <Typography style={{
            fontFamily: 'Poppins, sans-serif', fontSize: '30px',
            padding: '20px', fontWeight: 'bold', color: 'white'
        }}>
            {displayedText}
        </Typography>
    );
};

let image2url = null;
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState('');

    const onLogin = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUserDetails(user);
                checkUserAvailable(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage)
                console.log(errorCode, errorMessage)
            });

    }

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        const googleAuthProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleAuthProvider)
            .then((userCredential) => {
                const user = userCredential.user;
                image2url = user.photoURL;
                setUserDetails(user);
                checkUserAvailable(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage)
                console.log(errorCode, errorMessage)
            });

    }

    const checkUserAvailable = async (authUser) => {
        if (authUser) {
            const userUid = authUser.uid;
            const userDetailsRef = ref(db, `users/${userUid}/userDetails`);

            try {
                const snapshot = await get(userDetailsRef);
                if (snapshot.exists()) {
                    setUserPresent(true);
                    setUserData(snapshot.val());
                    navigate("/dashboard")
                } else {
                    setUserPresent(false);
                    navigate("/dashboard")
                }
            } catch (error) {
                console.error('Error checking student details data:', error);
            }
        }
    }

    return (
        <MainContainer>
            <FirstHalf>
                <div style={{
                    width: '60%',
                    background: 'white',
                    borderRadius: '16px',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <Typography color='GrayText' style={{
                        fontFamily: 'Poppins, sans-serif', fontSize: '40px',
                        padding: '20px', fontWeight: 'bold'
                    }}>DiseaseFree Areca</Typography>
                    <Typography style={{
                        fontFamily: 'Poppins, sans-serif', fontSize: '20px',
                        padding: '20px', fontWeight: 'bold'
                    }}>Log in to your account</Typography>
                    <Typography
                        style={{
                            fontFamily: 'Poppins, sans-serif', fontSize: '20px',
                            padding: '20px', fontWeight: 'bold',
                        }}
                        onClick={() => navigate('/')}
                    >
                        Don't have an account? <span style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue', }} onClick={() => navigate('/')}>
                            Sign Up
                        </span>
                    </Typography>
                    <GoogleButton
                        className="g-btn"
                        type='dark'
                        onClick={onGoogleSignIn}
                    />
                    <Typography style={{
                        marginTop: 20, fontFamily: 'Poppins, sans-serif', fontSize: '20px',
                        padding: '16px', fontWeight: 'bold',
                    }}>
                        Or with email and password
                    </Typography>
                    <InputLabel htmlFor="input-with-icon-adornment" style={{ fontFamily: '"Poppins-Medium", Helvetica' }}>
                        Email
                    </InputLabel>
                    <Input
                        id="input-with-icon-adornment"
                        color="secondary"
                        label="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '300px', height: '50px' }}
                        startAdornment={
                            <EmailIcon position="start" style={{ padding: '5px' }}>
                                <AccountCircle />
                            </EmailIcon>
                        }
                    />
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        variant='standard'
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '300px', height: '50px' }}
                        size='medium'
                        required
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            ),
                        }}
                    />
                    <GenerateButton onClick={onLogin}>Login</GenerateButton>
                    {error && <Typography variant="danger" style={{ padding: '20px', fontFamily: 'Poppins, sans-serif', }}>{error}</Typography>}
                </div>
            </FirstHalf>
            <SecondHalf>
                <TypingEffect text="Welcome to our journey, where innovation meets agriculture. " speed={100} />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    pointerEvents: 'none',


                    overflow: 'hidden',
                    opacity: 0.5,
                }}>
                    <img
                        src={image1url}
                        alt="Login"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </SecondHalf>
        </MainContainer>
    )
}

export { image2url };
export default Login;