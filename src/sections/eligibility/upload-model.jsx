import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Alert,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CloseIcon } from "src/components/icon/common-icon";
import { useOcrMutation } from "src/framework/rest/eligibility/eligibility.query";
import toast from "react-hot-toast";
import CustomDialog from "src/components/customDialog";
import { AutoAwesome } from "@mui/icons-material";

const UploadModal = ({ onSuccess }) => {
    const [files, setFiles] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleModalOpen = () => {
        setOpen(true);
    };
    const toggleModalClose = () => {
        setOpen(false);
        setFiles(null);
    };

    //   const { mutate: ocr, isLoading } = useOcrMutation();

    const onSubmit = async () => {
        if (!files) return;

        if (files.length === 0) return;

        const [file] = files;

        // const [file] = event.target.files;
        const fileSize = file.size;
        const fileMb = fileSize / 1024 ** 2;

        if (fileMb <= 5) {
            const formData = new FormData();
            formData.append("image", file);
            setIsLoading(true);
            fetch(`${import.meta.env.VITE_ELIGIBILITY_PATIENT_URL ?? ""}/ocr`, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    setIsLoading(false);
                    console.log(data, "FILE DATA")
                    onSuccess(data);
                    toast.success("Text successfully extracted from document!", {
                        duration: 2000,
                    });
                    toggleModalClose();
                })
                .catch(error => {
                    setIsLoading(false);
                    console.log(error, "ERROR")
                    toast.error("Document upload failed!", { duration: 3000 });
                });
        } else {
            toast.error("File size should not exceed 5MB");
        }

    };

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const supportedFileFormats = ["image/jpeg", "image/png"];

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <>
            <Button variant="outlined" color="primary" onClick={toggleModalOpen} endIcon={<AutoAwesome />}>
                Upload
            </Button>

            <CustomDialog
                      open={open}
                      onClose={toggleModalClose}
                      title="Upload"
                      content={
                        <>
                    {isLoading ? (
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={3}>
                            <CircularProgress />
                            <Typography mt={2}>Extracting text from the document...</Typography>
                        </Box>
                    ) : (
                        <>
                            {!files ? (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{ border: "2px dashed #06AB89", padding: 3, cursor: "pointer" }}
                                    onClick={() => document.getElementById("file-input").click()}
                                >
                                    <FontAwesomeIcon icon={faImage} size="2x" />
                                    <Typography mt={2}>Upload Images</Typography>
                                </Box>
                            ) : (
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography>{files[0].name}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {formatBytes(files[0].size)}
                                                </Typography>
                                            </Box>
                                            <IconButton
                                                color="error"
                                                onClick={() => setFiles(null)}
                                                disabled={isLoading}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}
                            <input
                                id="file-input"
                                type="file"
                                accept="image/jpeg,image/png"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            {!files && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Supported formats: JPEG, PNG. Max size: 5MB.
                                </Alert>
                            )}
                        </>
                    )}

                    <Button onClick={toggleModalClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onSubmit}
                        disabled={!files || isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Upload"}
                    </Button>
                </>
                }
                />
        </>
    );
};

export default UploadModal;
