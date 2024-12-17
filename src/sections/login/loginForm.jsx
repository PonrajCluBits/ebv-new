import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import { LoadingButton } from '@mui/lab';
import { Box, Grid, Checkbox, TextField, Typography, InputLabel, FormHelperText, FormControlLabel } from '@mui/material';

import { AuthContext } from '../auth/authContext';

const LoginForm = ({ onForgetPwd }) => {
  const { login } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Define validation schema using yup
    const validationSchema = yup.object().shape({
      email: yup.string().email('Invalid Email-Id').required('Email is required'),
      password: yup.string().min(7, 'Password must be at least 7 characters').required('Password is required'),
    });

    const { register, handleSubmit, formState: { errors }, } = useForm({resolver: yupResolver(validationSchema),});


    const onSubmit = async (data) => {
        setIsLoading(true)
        // await login(data);
        await login(data).then(response => {
          console.log("Login successful:", response);
          navigate('/');
          setError("")
        })
        .catch(error => {
          console.error("Login failed:", error?.error?.message);
          setError(error?.error?.message)
        });
        setIsLoading(false)
        navigate("/")
      };

    return (
        <Box className='block pt-20 w-11/12 pb-20'>
            <Typography variant="h5" className='text-gray-700 text-xl font-medium'>Login</Typography>
            <Typography variant="body2" className='text-gray-700 text-sm font-medium'>Enter registered Email-ID and password</Typography>
            <form className="mt-7" onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <InputLabel>Email</InputLabel>
                    <TextField
                      placeholder="Email"
                      size="small"
                    //   multiline
                    //   rows={3}
                      {...register("email")}
                      fullWidth
                      id="email"
                      className="border-[#000000] border rounded-[5px]"
                      sx={{
                        "& .MuiInputBase-input": { color: "text.secondary" },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#000000', 
                            borderRadius: "5px"
                          },
                        },
                      }}
                    />
                    <FormHelperText sx={{ color: "error.main" }}>
                    {errors && errors.email && errors.email.message && (
                      <Typography>{errors.email.message}</Typography>
                    )}
                    </FormHelperText>
                </Box>
                <Box className="relative">
                    <InputLabel>Password</InputLabel>
                    <TextField
                      placeholder="Password"
                      size="small"
                    //   multiline
                    //   rows={3}
                        type={showPassword ? 'text' : 'password'}
                      {...register("password")}
                      fullWidth
                      id="password"
                      className="border-[#000000] border rounded-[5px]"
                      sx={{
                        "& .MuiInputBase-input": { color: "text.secondary" },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#000000', 
                            borderRadius: "5px"
                          },
                        },
                      }}
                    />
                    {showPassword ? (
                        <Visibility
                            className="absolute top-9 transform -translate-y-1/2 right-5 mt-2 text-base text-gray-700 cursor-pointer"
                            onClick={togglePasswordVisibility}
                        />
                    ) : (
                        <VisibilityOff
                            className="absolute top-9 transform -translate-y-1/2 right-5 mt-2 text-base text-gray-700 cursor-pointer"
                            onClick={togglePasswordVisibility}
                        />
                    )}
                    
                    <FormHelperText sx={{ color: "error.main" }}>
                    {errors && errors.password && errors.password.message && (
                      <Typography>{errors.password.message}</Typography>
                    )}
                    </FormHelperText>
                    
                    
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={7} className="flex items-center check-forgot pt-2">
                        <FormControlLabel
                            control={<Checkbox className='' style={{ color: "#0771DE" }} />}
                            label="Remember me"
                        />
                    </Grid>
                    <Grid item xs={12} sm={5} className="flex ite ms-center check-forgot pt-2">
                        {/* <Link href="/forgot-password" onClick={onForgetPwd} underline="always" sx={{ mt: 1 }}> */}
                          <Typography sx={{color: "#C350EC", cursor: 'pointer'}}>  Forgot password?</Typography>
                        {/* </Link> */}
                    </Grid>
                    <Grid item xs={12}>
                      {error != "" && <Alert severity="error"
                        onClose={() => {setError("")}}>
                        {error}
                      </Alert>}
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            className="w-full"
                            loading={isLoading}
                            style={{ background: isLoading ? "": "linear-gradient(88deg, #007BED 0%, #C350EC 97.19%)", color: "#fff" }}
                        >
                            Login
                        </LoadingButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography align="right" variant="body2" >
                            Need Help?
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default LoginForm;
