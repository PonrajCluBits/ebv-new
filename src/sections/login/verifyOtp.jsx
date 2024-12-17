import React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';

import {  Grid, Button, TextField, Typography } from '@mui/material';

const VerifyOtp = ({onVerifyOTP}) => {
    const navigate = useNavigate();
    // Define validation schema using yup
    const validationSchema = yup.object().shape({
        email: yup.string().matches(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,4}$/,
            'Invalid Email-Id'
        ).required('Email is required')
    });

    // useFormik hook for handling form state and validation
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: (values) => {
            navigate("/sample");
        },
    });
    return (
        <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
                <Typography variant='h5' color='textPrimary'>OTP Verification</Typography>
                <Typography variant='body1' color='textSecondary'>Enter One-Time-Password sent to your Email-ID</Typography>
            </Grid>
            <Grid item>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container direction="row" spacing={1}>
                        {[1, 2, 3, 4, 5, 6].map((_, index) => (
                            <Grid item key={index}>
                                <TextField
                                    type="number"
                                    name={`otp${index}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values[`otp${index}`]}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{ maxLength: 1 }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                    >
                        Verify OTP
                    </Button>
                    <Typography variant='body2' color='textSecondary'>
                        <Link to="/sample" color="inherit">Resend OTP</Link>
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                        Need Help?
                    </Typography>
                </form>
            </Grid>
        </Grid>
    )
}
export default VerifyOtp;
