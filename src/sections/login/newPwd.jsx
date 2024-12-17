import * as yup from 'yup';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, TextField, IconButton, Typography, InputAdornment } from '@mui/material';

const NewPassword = ({ onReset }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showMessage] = useState(false);
    const [message] = useState('');
    const navigate = useNavigate();

    // const showToast = (messages) => {
    //     setMessage(messages);
    //     setShowMessage(true);
    //     setTimeout(() => {
    //         setShowMessage(false);
    //     }, 3000); // Hide the message after 3 seconds
    // };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Define validation schema using yup
    const validationSchema = yup.object().shape({
        password: yup.string().min(7, 'Password must be at least 7 characters').required('Password is required'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
    });

    // useFormik hook for handling form state and validation
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: (values) => {
            navigate("/sample");
        },
    });

    return (
        <Box className="block mt-20 w-11/12 mb-48">
            <Box className={`fixed bottom-0 right-0 p-4 bg-green-500 text-white ${showMessage ? 'block' : 'hidden'}`}>
                {message}
            </Box>
            <Typography className='text-gray-900 text-xl font-semibold'>Create New Password</Typography>

            <form className="mt-7" onSubmit={formik.handleSubmit}>
                <TextField
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="mt-2"
                    type="submit"
                    onClick={onReset}
                >
                    Reset
                </Button>
                <Typography className='float-end text-sm pt-5'>Need Help?</Typography>
            </form>
        </Box>
    );
};

export default NewPassword;
