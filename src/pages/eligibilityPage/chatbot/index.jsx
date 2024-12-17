import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import PatientData from 'src/sections/eligibility/dashboard/PatientData';

export default function EligibilityChatBot() {
  return (
    <>
      <Box
        sx={{
          backgroundColor: '#ededed',
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          paddingRight: 5,
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ ml: 3 }}>
          Chatbot
        </Typography>
      </Box>
        <Typography>Chatbot Page</Typography>
    </>
  );
}
