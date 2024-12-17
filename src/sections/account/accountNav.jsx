import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import { Box, Stack, Drawer, Typography } from '@mui/material';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import Scrollbar from 'src/components/scrollbar';



export default function AccountNav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment !== '')

  function capitalizeFirstLetter(text) {
    if (!text || typeof text !== 'string') {
      return text; 
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const userRoll = "admin"

  const navAdmin = userRoll === "admin" ? [
    {
      title: 'Logo',
      path: '/account/Logo',
    }
  ] : []

  const navConfig = [
    {
      title: 'Profile',
      path: '/account/profile',
    },
    {
      title: 'Personalization',
      path: '/account/personalization',
    },
    ...navAdmin
  ];


  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 3, py: 3, gap:2 }}>
      {navConfig.map((item) => (
        <AccountNavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        mt: 2,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{borderBottom: 'solid', borderBottomWidth: "2px", borderBottomColor: "#c2c2c2"}}>
        <Typography variant='h4' sx={{p:3}}>{capitalizeFirstLetter(pathSegments[1])}</Typography>
      </Box>

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: "300px" },
        backgroundColor: '#fff',
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: "300px",
            borderRight: "solid",
            borderRightWidth: "2px",
            borderColor: "#c2c2c2"
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: "300px",
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

AccountNav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function AccountNavItem({ item }) {
  const pathname = usePathname();
  const theme = useTheme();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: '#000',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        fontSize: "20px",
        ":hover": {
          backgroundColor: '#fcfcfc',
          color: '#000000',
        },
        flexDirection: 'column',
        alignItems:'start',
        ...(active && {
          color: '#000000',
          borderLeft : 'solid',
          borderWidth : '4px',
          borderLeftColor : `${theme.palette.primary.main}`,
          fontWeight: 'fontWeightSemiBold',
          // bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.08),
          // '&:hover': {
          //   bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.16),
          // },
          backgroundColor : '#ffffff',
          ":hover": {
            backgroundColor: '#fcfcfc'
          }
        }),
      }}
    >

      <Box component="span" className='flex whitespace-nowrap pb-2'> {item.title} </Box>
    </ListItemButton>
  );
}

AccountNavItem.propTypes = {
  item: PropTypes.object,
};
