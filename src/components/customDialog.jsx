import React from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Dialog, Typography, DialogTitle, DialogContent } from '@mui/material';

const CustomDialog = ({ open, onClose, title, content, dialogWidth = 600 }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      // sx={{
      //   '& .MuiDialog-paper': { // Targeting the Paper component within the Dialog
      //     width: dialogWidth,
      //     maxWidth: 'none', // Allow width to exceed the default maxWidth
      //     background: `linear-gradient(30deg, #FFFFFF , ${theme.palette.primary.light} )` // Use background instead of backgroundColor
      //   }
      // }}
    >
      <DialogTitle>
        <Typography
          sx={{
            borderLeft: 'solid',
            borderLeftWidth: 4,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            borderLeftColor: theme.palette.primary.main,
            px: 1,
            height: 50,
            alignContent: 'center',
            fontSize: 20,
            fontWeight: 'bold'
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
    </Dialog>
  );
}

CustomDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  dialogWidth: PropTypes.number, // Add PropType for dialogWidth
};

export default CustomDialog;
