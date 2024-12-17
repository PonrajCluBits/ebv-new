import React, { useState } from 'react';

import { Card, Modal, CardMedia, Typography, CardContent } from '@mui/material';

const ImageViewer = ({ imageUrl, imageTitle }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card>
      <CardMedia
        component="img"
        height="300"
        image={imageUrl}
        alt={imageTitle}
        onClick={handleOpen} // Open modal on image click
        style={{ cursor: 'pointer' }} // Show pointer cursor on hover
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {imageTitle}
        </Typography>
      </CardContent>

      {/* Modal for full screen image view */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="full-screen-image"
        aria-describedby="full-screen-image-description"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 'none',
          }}
        >
          <img src={imageUrl} alt={imageTitle} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
      </Modal>
    </Card>
  );
};

export default ImageViewer;
