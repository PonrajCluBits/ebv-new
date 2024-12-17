import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import { Paper, Popper, Tooltip, IconButton, Typography } from '@mui/material';
import { ZoomInMap, ZoomOutMap, KeyboardArrowRight } from '@mui/icons-material';

import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import Scrollbar from 'src/components/scrollbar';

import navConfig from './config-navigation';

export default function Nav({ openNav, onCloseNav }) {
  // const pathname = usePathname();
  const theme = useTheme();
  const upLg = useResponsive('up', 'lg');
  const [minimized, setMinimized] = useState(true);
  const [openItemId, setOpenItemId] = useState(null); // Track the open menu

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  const handleMenuClick = (id) => {
    // Toggle the current menu open/close and close others
    setOpenItemId((prevId) => (prevId === id ? null : id));
  };

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 1 }}>
      <Box
        onClick={toggleMinimize}
        sx={{
          borderRadius: 0.75,
          color: '#fcfcfc',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          display: 'flex',
          gap: minimized ? 0 : 2,
          p: 1,
          backgroundColor: theme.palette.grey[800],
          flexDirection: minimized ? 'column' : 'row',
          cursor: 'pointer',
        }}
      >
        <Box component="span" display='flex' justifyContent='center'>
          <Typography sx={{ width: 20, height: 20 }}>
          {minimized ? <ZoomOutMap /> : <ZoomInMap />}
          </Typography>
        </Box>
          <Box component="span" className="flex justify-center whitespace-nowrap">
          { minimized ?<Typography mt={1} fontSize={10} component="span">Maximize</Typography> : <Typography component="span">Minimize</Typography> }
          </Box>
      </Box>
      {navConfig.map((item) => (
        <NavItem
          key={item.title}
          item={item}
          minimized={minimized}
          openItemId={openItemId}
          onMenuClick={handleMenuClick}
        />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: '90%',
        mt: 3,
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {renderMenu}
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      className="z-30"
      sx={{
        flexShrink: { lg: 0 },
        width: minimized ? 80 : 230,
        transition: theme.transitions.create('width', {
          duration: theme.transitions.duration.standard,
        }),
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: minimized ? 80 : 230,
            background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%,${theme.palette.primary.mainSecondary} 100%)`,
            borderRight: `dashed 1px ${theme.palette.divider}`,
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
              width: 200,
              backgroundColor: theme.palette.primary.main,
              pt: 2,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

function NavItem({ item, minimized, openItemId, onMenuClick, childMenu = false }) {
  const [anchorEl, setAnchorEl] = useState(null); // Track the anchor element
  const [menuOpen, setMenuOpen] = useState(false); // Track the anchor element
  const open = openItemId === item.title; // Check if this menu is open
  const hasChildren = item.children && item.children.length > 0;
  const navigate = useNavigate()
  const theme = useTheme()
  const pathname = usePathname();

  const active = item.path === pathname;

  const handleClick = (event) => {
    // Set anchor to the clicked element and toggle open state
    setMenuOpen(!menuOpen)
    setAnchorEl(event.currentTarget);
    onMenuClick(item.title);
    navigate(item.path)
  };

  return (
    <Box>
      <ListItemButton
        onClick={handleClick}
        href={item.path}
        sx={{
          // width: 100,
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          color: "#fff",
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          ':hover': {
            backgroundColor: theme.palette.primary.lighter,
            color: theme.palette.primary.darker,
          },
          ...(active && {
            color: theme.palette.primary.darker,
            fontWeight: 'fontWeightSemiBold',
            backgroundColor: theme.palette.primary.lighter,
            ':hover': {
              backgroundColor: theme.palette.primary.light,
            },
          }),
          flexDirection: minimized ? 'column' : 'row',
        }}
      >
        <Tooltip title={item.title} placement="top-end">
          <Box component="span" sx={{ width: 25, height: 25, mr: minimized ? 0 : 1 }}>
            {item.icon}
          </Box>
        </Tooltip>
        {minimized ? 
        <Box width="100%" justifyContent='center' display='flex' textAlign='center'>
        <Typography fontSize={10}>{item.title}</Typography>
        </Box> : (
          <Box
            component="span"
            sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
          >
            {childMenu ? <Typography color={theme.palette.primary.darker}>{item.title}</Typography> : item.title}
            {hasChildren && (
              <IconButton sx={{ width: 20, height: 20, mr: 1, color: theme.palette.primary.dark }}>
                <KeyboardArrowRight />
              </IconButton>
            )}
          </Box>
        )}
      </ListItemButton>

      {hasChildren && (
        <Popper
          open={open}
          anchorEl={anchorEl} // Use anchor element for alignment
          placement="right-start" // Align to the right of the parent menu
          sx={{ zIndex: 1300 }}
        >
          <Paper elevation={3} sx={{ mt: 1, ml: 1, backgroundColor: '#FFF', boxShadow: 20 }}>
            <Stack spacing={0.5} sx={{ p: 1, minWidth: 180 }}>
              {item.children.map((child) => (
                <NavItem
                  key={child.title}
                  item={child}
                  minimized={false}
                  openItemId={openItemId}
                  onMenuClick={onMenuClick}
                  childMenu
                />
              ))}
            </Stack>
          </Paper>
        </Popper>
      )}
    </Box>
  );
}

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  minimized: PropTypes.bool.isRequired,
  openItemId: PropTypes.string,
  onMenuClick: PropTypes.func.isRequired,
};