import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Typography,
  Box,
} from "@mui/material";

import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";
import { CloseIcon } from "src/components/icon/common-icon";

const QRModal = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const uniqueId = useRef(uuidv4());
  const clientId = uniqueId.current;

  const link = useRef(
    `$${
      import.meta.env.VITE_LOCAL_APP_URL_FOR_TESTING || window.location.origin
    }/scan-document?clientId=${clientId}`
  );

  const toggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (!open) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_ELIGIBILITY_PATIENT_URL ?? ""}/events?clientId=${clientId}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onSuccess(data);
      setOpen(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [open, clientId, onSuccess]);

  return (
    <>
      <Button variant="outlined" color="primary" onClick={toggle}>
        Scan QR
      </Button>

      <Dialog open={open} onClose={toggle} maxWidth="lg">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Scan QR Code</Typography>
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", padding: "2rem" }}>
          <Box display="flex" justifyContent="center" alignItems="center" my={5}>
            <QRCode value={link.current} />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRModal;
