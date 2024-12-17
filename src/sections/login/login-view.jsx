import React, { useState } from 'react';

import { Box, Typography } from '@mui/material';

import SendOtp from './sendOtp';
import p2 from './images/p-2.png';
import NewPassword from './newPwd';
import LoginForm from './loginForm';
import VerifyOtp from './verifyOtp';

const Login = () => {
    const [forgotPassword, setForgotPassword] = useState(false);
    const [showSendOtp, setShowSendOtp] = useState(false);
    const [showVerifyOtp, setShowVerifyOtp] = useState(false);
    const [resetPwd, setResetPwd] = useState(false);
    // const theme = useTheme();
    // const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleForgotPassword = () => {
        setForgotPassword(true);
    };

    const handleSendOTP = () => {
        setShowSendOtp(true);
    };

    const handleVerifyOTP = () => {
        setShowVerifyOtp(true);
    };

    const handleReset = () => {
        setResetPwd(true);
    };

    return (
        <Box>

            <img className='h-24 mt-28' src={p2} alt="" />
            <Typography variant="h6" className='text-gray-700 text-xl font-medium'>Connect, engage and grow with PractIOT</Typography>
            {!forgotPassword ? (
                <LoginForm onForgetPwd={handleForgotPassword} />
            ) : (
                <Box>
                    {!showSendOtp ? (
                        <SendOtp onSendOTP={handleSendOTP} />
                    ) : (
                        <Box>
                            {!showVerifyOtp ? (
                                <VerifyOtp onVerifyOTP={handleVerifyOTP} />
                            ) : (
                                <Box>
                                    {!resetPwd ? (
                                        <NewPassword onReset={handleReset} />
                                    ) : (
                                        <LoginForm />
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default Login;
