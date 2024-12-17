import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom/dist';

import { Box, Grid, Typography } from '@mui/material';

import LoginBanner from 'src/components/loginBanner';

import { LoginView } from 'src/sections/login';
import { AuthContext } from 'src/sections/auth/authContext';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate();

  if (user && user?.data[0] && user?.data[0]?.UserID) {
    navigate("/")
  }
  return (
    <>
      <Helmet>
        <title> Login | Minimal UI </title>
      </Helmet>
      <Grid container sx={{ height: '100%' }}>
        <Grid
          item
          md={6}
          sx={{
            background: "linear-gradient(88deg, #007BED 0%, #C350EC 97.19%)",
            height: '100%'
          }}

        >
          <Box height='100%' px={6} display='flex' gap={5} flexDirection='column' justifyContent='center'>
            <Box className="mt-4">
              <Typography variant='h3' className="text-white mb-0">One Integrated Solution</Typography>
              <Typography variant='h4' className="text-black">for your Practice</Typography>
            </Box>

            <Box className="mb-5">
              <Typography className="text-white">
                Revenue | Appointments | Treatment Plans
              </Typography>
            </Box>

            <LoginBanner />
          </Box>
        </Grid>

        <Grid item md={6} height='100%'>
          <Box height='100%' px={6} display='flex' gap={5} flexDirection='column' justifyContent='center'>
            <LoginView />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
