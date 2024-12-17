import React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';

import { Box, Grid, Button, TextField, Typography } from '@mui/material';

const SendOtp = () => {
    const validationSchema = yup.object().shape({
        email: yup.string().matches(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            'Invalid Email-Id'
        ).required('Email is required')
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        onSubmit: (values) => {
            // Handle form submission   
        },
    });

    return (
        <Box mt={20} width="11/12" mb={48}>
            <Typography variant='h5' color='textPrimary' fontWeight='bold'>Forgot Password</Typography>
            <Typography variant='body1' color='textSecondary'>Enter registered Email-ID to reset password</Typography>
            <form onSubmit={formik.handleSubmit}>
                <Box mt={7}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        type="email"
                        name='email'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                </Box>
                <Grid container mt={2}>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ backgroundColor: '#0771DE', color: "#fff" }}
                        >
                            Send OTP
                        </Button>
                    </Grid>
                </Grid>
                <Typography variant='body2' color='textSecondary' textAlign='right' mt={2}>Need Help?</Typography>
            </form>
        </Box>
    );
}

export default SendOtp;
