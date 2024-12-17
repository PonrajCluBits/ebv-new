import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { CloseIcon } from "src/components/icon/common-icon";


export const ConfirmationModal = ({
  onClick,
  value,
}) => {
  const [open, setOpen] = React.useState(false);
  const [disable, setDisable] = React.useState(false);

  const toggle = () => setOpen((prev) => !prev);

  const handleConfirmation = () => {
    setDisable(true);
    onClick();
    toggle();
  };

  React.useEffect(() => {
    if (disable) {
      const timer = setTimeout(() => {
        setDisable(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [disable]);

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggle}>
        {value}
      </Button>

      <Dialog open={open} onClose={toggle} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "primary.main",
            color: "#fff",
          }}
        >
          Confirmation
          <IconButton aria-label="close" onClick={toggle} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", padding: "2rem" }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to confirm the details?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            <Button variant="outlined" color="secondary" onClick={toggle}>
              No
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmation}
              disabled={disable}
            >
              Yes
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmationModal;
