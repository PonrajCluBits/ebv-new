import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { dateFormat } from "src/utils/date-format";
import { getUserId } from "src/utils/get-userId";
import { API_ENDPOINTS } from "src/utils/endpoints";
import { useQueryClient } from "react-query";
import { usePatientBulkVerifyMutation } from "src/framework/rest/eligibility/eligibility.query";
import toast from "react-hot-toast";

const BulkVerificationWarningModal = ({ open, handleClose, state }) => {
  const queryClient = useQueryClient();

  const timeFormat = (lastVerified) => {
    const dateObj = new Date(lastVerified);
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const { mutate: bulkVerify,  isLoading: verifyIsLoading } = usePatientBulkVerifyMutation()
  const { mutate: excludeVerify, isLoading: excludeIsLoading } = usePatientBulkVerifyMutation()

  console.log(state, "PATIENT DATA")

  const verifyPatientNew = async () => {
    const passingData = {
      ids: state.map((data) => ({
        uniqueId: data.uniqueId,
        isScheduled: data.isScheduled,
        adminId: getUserId(),
      })),
    }

    console.log(passingData, "PASSING DATA")
    bulkVerify(passingData,{
        onSuccess: async (v) => {
            toast.success("Patients verified Successfully", { duration: 3000 });
            queryClient.refetchQueries(API_ENDPOINTS.PATIENT_LIST);
            handleClose()
        },
        onError : (error) => {
          console.log(error, "ERROR")
          toast.error("Patient verification failed!", { duration: 3000 });
          handleClose()
        },
      });            
  };

  const excludePatientNew = async () => {
    const last3Days = new Date();
    last3Days.setDate(last3Days.getDate() - 3);
    const filteredData = state.filter((item) => {
      if (!item.lastVerifiedDate) {
        return true;
      }
      const [day, month, year] = item.lastVerifiedDate.split("-");
      const verifiedDate = new Date(`${year}-${month}-${day}`);
      return verifiedDate < last3Days;
    });

    excludeVerify({
      ids: filteredData.map((data) => ({
        uniqueId: data.uniqueId,
        isScheduled: data.isScheduled,
        adminId: getUserId(),
      })),
    },{
        onSuccess: async (v) => {
            toast.success("Patients verified Successfully", { duration: 3000 });
            queryClient.refetchQueries(API_ENDPOINTS.PATIENT_LIST);
            handleClose()
        },
        onError : (error) => {
          console.log(error, "ERROR")
          toast.error("Patient verification failed!", { duration: 3000 });
          handleClose()
        },
      });            
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ backgroundColor: "primary.main", color: "white" }}>
        Confirmation
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Below Patient is recently verified in the last{" "}
          <strong>{/* Replace this dynamically */ "3"}</strong> days. Are you
          sure you want to proceed?
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patients</TableCell>
              <TableCell>Last Verified Date</TableCell>
              <TableCell>Last Verified Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state?.map((data) => (
              <TableRow key={data.uniqueId}>
                <TableCell>
                  {data.firstName} {data.lastName}
                </TableCell>
                <TableCell>{dateFormat(new Date(data.lastVerified))}</TableCell>
                <TableCell>{timeFormat(data.lastVerified)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={verifyPatientNew}
          disabled={verifyIsLoading /* Replace with loading state */}
        >
          {/* Replace with a condition for loading */}
          {verifyIsLoading ? (
            <>
              <CircularProgress size={20} sx={{ marginRight: 1 }} />
              Verifying...
            </>
          ) : (
            "Include last verified"
          )}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={excludePatientNew}
          disabled={excludeIsLoading /* Replace with loading state */}
        >
          {excludeIsLoading ? (
            <>
              <CircularProgress size={20} sx={{ marginRight: 1 }} />
              Excluding...
            </>
          ) : (
            "Exclude last verified"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkVerificationWarningModal;
