import React from "react";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { usePatientVerifyMutation, useVerifyPatientUtilsQuery } from "src/framework/rest/eligibility/eligibility.query";
import { getUserId } from "src/utils/get-userId";
import { useQueryClient } from "react-query";
import { API_ENDPOINTS } from "src/utils/endpoints";

export const VerificationWarningModal = ({
    uniqueId,
    isScheduled,
    lastName,
    lastVerified,
    firstName,
    closeModal,
    open,
}) => {
    const queryClient = useQueryClient();

    const datetimeString = lastVerified;
    const dateObj = new Date(datetimeString);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    const date = `${year}-${formattedMonth}-${formattedDay}`;
    const time = `${hours}:${minutes}:${seconds}`;

    const { mutate: verification, isLoading } = usePatientVerifyMutation();

    const { data: verifypatientUtils } = useVerifyPatientUtilsQuery({ userId: getUserId() });

    const warningDays = verifypatientUtils?.data?.warningdays;

    const verifyPatientNew = async () => {
        try {
            verification(
                {
                    uniqueId,
                    isScheduled,
                    userId: getUserId(),
                    lastName,
                    lastVerified,
                    firstName
                },
                {
                    onSuccess: (res) => {
                        queryClient.refetchQueries(API_ENDPOINTS.PATIENT_LIST);
                        if (!res?.error) {
                            toast.success("Patient verified Successfully");
                        } else {
                            throw new Error("Verification failed");
                        }

                        if (res.data?.eligibility?.errors?.length) {
                            toast.error("Patient verification failed!");
                        }
                        closeModal()

                    },
                    onError: (error) => {
                        queryClient.refetchQueries(API_ENDPOINTS.PATIENT_LIST);
                        console.error(error);
                        toast.error(error?.response?.data?.message || "An error occurred", { duration: 3000 });
                        closeModal()
                    },
                }
            );
        } catch (error) {
            toast.error("Patient verification failed!");
            console.error(error);
            closeModal();
        }
    };

    return (
        <Dialog open={open} onClose={closeModal} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ backgroundColor: "primary.main", color: "white" }}>
                Confirmation
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    Below Patient is recently verified in last {warningDays} days. Are you sure you want to proceed?
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Patient</TableCell>
                            <TableCell>Last Verified Date</TableCell>
                            <TableCell>Last Verified Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{firstName} {lastName}</TableCell>
                            <TableCell>{date}</TableCell>
                            <TableCell>{time}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={verifyPatientNew}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <CircularProgress size={20} sx={{ marginRight: 1 }} />
                            Verifying...
                        </>
                    ) : (
                        "Yes"
                    )}
                </Button>
                <Button variant="outlined" color="secondary" onClick={closeModal}>
                    No
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VerificationWarningModal;
