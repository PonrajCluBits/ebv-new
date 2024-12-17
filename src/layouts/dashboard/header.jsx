import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import { Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
// import SearchIcon from '@mui/icons-material/Search';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';

import AccountPopover from './common/account-popover';
import NotificationsPopover from './common/notifications-popover';


// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      <Box pr={2} marginRight={4} sx={{width: "10%"}}>
        <img src="/images/login/logo.png" alt="help_desk" style={{ width: '100px', maxHeight: '20%' }} />
      </Box>
    

      <TextField
      size='small'
      sx={{width: '500px'}}
      variant="outlined"
      placeholder="Search..."
      InputProps={{
        endAdornment: (
          <Iconify icon="eva:search-fill" />
        ),
      }}
    />

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>

        <Box border={1} borderRadius={20} padding={0.5} borderColor="#545454" 
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Iconify icon="eva:pin-outline" color="#a16eff" sx={{marginLeft: 2}}/>
          <Typography color='#0a0a0a' marginRight={2}>Dallas</Typography>
        </Box>

          {/* <DashboardIcon /> */}
        
        <NotificationsPopover />
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: 64,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        backgroundColor: 'white',
        borderBottom: 'solid',
        borderColor: '#F5F5F5'

      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
