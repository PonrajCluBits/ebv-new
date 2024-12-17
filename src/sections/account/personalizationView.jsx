import React from 'react';
import "react-quill/dist/quill.snow.css";

import { useTheme } from '@mui/material/styles';
import { Box, Stack, Button, Typography } from '@mui/material';

import { TickIcon } from 'src/components/icon/common-icon';


const PersonalizationView = () => {
    const theam = useTheme();
    const selectedColor = localStorage.getItem('themeColor')
    // const [primaryColor, setPrimaryColor] = useState();

    const changePrimaryColor = (color) => {
        localStorage.setItem('themeColor', color);
        window.location.reload()
    };

    return(
        <Box sx={{ width: "100%", height: "100%", backgroundColor: "#fff"}}>
            <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1, py: 2, height: 70, width: "100%", backgroundColor: "#ebf5f7" }}
            >
            <Typography variant="h5" sx={{ ml: 1 }}>
              Settings
            </Typography>
            <Box>
              <Button sx={{ m: 1 }} variant="outlined" >
                Cancel
              </Button>
              <Button type="submit" sx={{ m: 1 }} variant="contained">
                Save
              </Button>
            </Box>
          </Stack>
          <Typography variant='h5' sx={{p: 2}}>Change Color</Typography>
            <Box sx={{display: 'flex', gap: 2, p:2}}>   
                { selectedColor === "blue" ? <Typography 
                    sx={{backgroundColor: theam.palette.blue.main, borderRadius: 10, border: 'solid', borderWidth: '3px'}} 
                    onClick={() => changePrimaryColor("blue")}> <TickIcon /> </Typography> 
                    : 
                    <Typography sx={{padding: 2.5, backgroundColor: theam.palette.blue.main,  width: 15, borderRadius: 10}} 
                    onClick={() => changePrimaryColor("blue")}> </Typography> }

                { selectedColor === "red" ? <Typography sx={{backgroundColor: theam.palette.red.main, borderRadius: 10, border: 'solid', borderWidth: '3px'}} 
                    onClick={() => changePrimaryColor("red")}> <TickIcon /> </Typography> 
                    : 
                    <Typography sx={{padding: 2.5, backgroundColor: theam.palette.red.main,  width: 15, borderRadius: 10}} 
                        onClick={() => changePrimaryColor("red")}> </Typography> }

                { selectedColor === "yellow" ? <Typography sx={{backgroundColor: theam.palette.yellow.main, borderRadius: 10, border: 'solid', borderWidth: '3px'}} 
                    onClick={() => changePrimaryColor("yellow")}> <TickIcon /> </Typography> 
                    : 
                    <Typography sx={{padding: 2.5, backgroundColor: theam.palette.yellow.main,  width: 15, borderRadius: 10}} 
                        onClick={() => changePrimaryColor("yellow")}> </Typography> }

                { selectedColor === "mintBlue" ? <Typography sx={{backgroundColor: theam.palette.mintBlue.main, borderRadius: 10, border: 'solid', borderWidth: '3px'}} 
                    onClick={() => changePrimaryColor("mintBlue")}> <TickIcon /> </Typography> 
                    : 
                    <Typography sx={{padding: 2.5, backgroundColor: theam.palette.mintBlue.main,  width: 15, borderRadius: 10}} 
                        onClick={() => changePrimaryColor("mintBlue")}> </Typography> }
                
            </Box>
        </Box>
    );
}

    

export default PersonalizationView;