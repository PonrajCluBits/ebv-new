import React from "react";
import { CircularProgress, MenuItem } from "@mui/material";
import { useLocation, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserId } from "src/utils/get-userId";
import { usePatientVerifyMutation, useVerifyPatientUtilsQuery } from "src/framework/rest/eligibility/eligibility.query";
import { useQueryClient } from "react-query";
import { API_ENDPOINTS } from "src/utils/endpoints";

export const VerifyPatient = (props) => {
  const {
    uniqueId,
    isScheduled,
    lastName,
    lastVerified,
    firstName,
    handleClose,
    setVerifyPatientModal
  } = props;

  const queryClient = useQueryClient()

  const { mutate: verification, isLoading } = usePatientVerifyMutation();

  const {data: verifypatientUtils} = useVerifyPatientUtilsQuery({userId : getUserId()})

  const verifyPatient = async (event) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      console.log(verifypatientUtils?.data?.warningdays, "M<NMBNNNNNBMBMB")

      if (
        lastVerified &&
        new Date().getTime() <
          new Date(
            new Date().setFullYear(
              new Date(lastVerified).getFullYear(),
              new Date(lastVerified).getMonth(),
              new Date(lastVerified).getDate() +
                verifypatientUtils?.data?.warningdays
            )
          ).getTime()
      ) {
        handleClose();
        setVerifyPatientModal({data :{ ...props }});
        return;
      }

    //   const res = await patients.mutateAsync(
    //     { uniqueId, isScheduled, lastName, lastVerified, firstName },
    //     {} // Add default mutate options if required
    //   );

      verification(
        { 
            uniqueId : uniqueId,
            isScheduled : isScheduled,
            userId : getUserId(),
            lastName : lastName, 
            lastVerified : lastVerified, 
            firstName : firstName 
        },
        {
            onSuccess: async (res) => {
                queryClient.refetchQueries(API_ENDPOINTS.PATIENT_LIST);
                // res?.notificationData && notify.dispatcher({ type: "increment-count" });
                if (!res?.error) {
                  toast.success("Patient verified successfully");
                } else {
                  throw new Error("Verification failed");
                }
          
                if (res.data?.eligibility?.errors?.length) {
                  toast.error("Patient verification failed!");
                }
            },
            onError: (error) => {
                queryClient.refetchQueries(API_ENDPOINTS.PATIENT_LIST);
                console.log(error, "ERROR")
                toast.error(error?.response?.data?.message, { duration: 3000 });
            },

        })
    } catch (error) {
      toast.error("Patient verification failed!");
      console.error(error);
    }
  };

  return (

      <MenuItem
        onClick={verifyPatient}
        disabled={isLoading}
        style={{ display: "flex", alignItems: "center" }}
      >
        {isLoading ? (
          <>
            <CircularProgress size={20} style={{ marginRight: "8px" }} />
            Verifying...
          </>
        ) : (
          "Verify Now"
        )}
      </MenuItem>
    );
};
