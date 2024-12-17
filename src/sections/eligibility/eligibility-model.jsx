import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// import ConfirmationModal from "../../components/confirmation-modal";
import toast from "react-hot-toast";
import { useAddPatientMutation, useInsurancePayerListQuery, useProcedureCodeListQuery, useProcedureTypeListQuery, useProviderListQuery } from "src/framework/rest/eligibility/eligibility.query";
import ConfirmationModal from "./confirmationModal";
import { getUserId } from "src/utils/get-userId";
import QRModal from "./qr-code";
import UploadModal from "./upload-model";
import { API_ENDPOINTS } from "src/utils/endpoints";
import { useQueryClient } from 'react-query';
import { CircularProgress } from "@mui/material";


export const eligibilityFormSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    dateOfBirth: yup.string().required("Date of birth is required"),
    memberId: yup.string().required("Member ID is required")
    });

    export const relationshipTypes = [
        { value: "01", label: "Spouse" },
        { value: "18", label: "Self" },
        { value: "19", label: "Child" },
        { value: "20", label: "Employee" },
        { value: "21", label: "Unknown" },
        { value: "22", label: "Handicapped Dependent" },
        { value: "29", label: "Signifcant Other" },
        { value: "34", label: "Other Adult" },
        { value: "41", label: "Injured Plaintiff" },
        { value: "53", label: "Life Partner" },
        { value: "76", label: "Dependent" },
        { value: "99", label: "Other" },
      ];

    export const appointmentRenderingProviders = [
        { value: "Dr. Kumar Vadivel", label: "Dr. Kumar Vadivel" },
        { value: "Dr. Archana Venkataraman", label: "Dr. Archana Venkataraman" },
        { value: "Dr. Manali Tanna Madhavani", label: "Dr. Manali Tanna Madhavani" },
      ];

export const EligibilityModal = ({ onSuccess }) => {
    const [relationShip, setRelationShip] = useState({})
    const [insurancePayer, setInsurancePayer] = useState({})
    const [primaryProvider, setPrimaryProvider] = useState({})
    const [appRenderingProvider, setAppRenderingProvider] = useState({})
    const [procedureCode, setProcedureCode] = useState({})
    const [procedureType, setProcedureType] = useState({})

    const queryClient = useQueryClient()

    const { data: providerdataResp, isLoading: providerLoading } = useProviderListQuery();
    const { data: insurancePayerList, isLoading: insurancePayerLoading } = useInsurancePayerListQuery();
    const { data: procedureCodeList, isLoading: procedureCodeLoading } = useProcedureCodeListQuery();
    const { data: procedureTypeList, isLoading: procedureTypeLoading } = useProcedureTypeListQuery();

    const { register, handleSubmit, setValue, resetField, reset, formState: { errors } } = useForm({
    resolver: yupResolver(eligibilityFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      memberId: "",
      relationship: "",
      provider: "",
      typeOfService: "",
      practiceNameAndLocation: "",
      appointmentType: "",
      GroupId: ""
    },
  });

  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  const toggleModalOpen = () => setOpen(true);
  const toggleModalClose = () => setOpen(false);

  const { mutate: createPatient, isLoading } = useAddPatientMutation();

  const onSubmit = (data) => {
    const providerDataFiltered = providerdataResp?.data?.find((e) => {
        return e.uniqueId === primaryProvider?.value;
      });

    const submitData =  {
        firstName: data.firstName,
        lastName: data.lastName,
        adminId: getUserId(),
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toString() : "",
        gender: "",
        groupId: data.GroupId,
        memberId: data.memberId ?? "",
        relationship: relationShip?.value || "",
        procedureType: data.procedureType,
        procedureCode: data.procedureCode,
        provider: providerDataFiltered?.doctorName || "",
        providerNpi: providerDataFiltered?.npiId,
        providerTaxId: providerDataFiltered?.taxId,
        providerFirstName: providerDataFiltered?.doctorName
          ?.split(" ")
          ?.slice(0, 1)
          ?.join(" "),
        providerLastName: providerDataFiltered?.doctorName
          ?.split(" ")
          ?.slice(1)
          ?.join(" "),
        insurancePayer: insurancePayer?.label,
        dependentFirstName:
          relationShip?.value === "18"
            ? data.firstName
            : data.dependentFirstName,
        dependentLastName:
          data.relationship === "18" ? data.lastName : data.dependentLastName,
        dependentDateOfBirth:
          data.relationship === "18"
            ? data.dateOfBirth
              ? data.dateOfBirth.toString()
              : ""
            : data.dependentDateOfBirth
              ? data.dependentDateOfBirth.toString()
              : "",
        verificationType: "manual",
        payerIdCode: insurancePayer?.value ?? "",
        typeOfService: data?.typeOfService !== null ? data?.typeOfService : "",
        practiceNameAndLoc:
            data?.practiceNameAndLocation !== null ? data?.practiceNameAndLocation : "",
        appointmentType: data?.appointmentType !== null ? data?.appointmentType : "",
        scheduleAppointment: data?.scheduleAppointment
          ? data?.scheduleAppointment.toString()
          : "",
        speciality : data?.Speciality,
        // subscriberId: data["subscriberId"],
        appointmentRenderingProvider : data?.appointmentRenderingProvider,
        medical: "",
        dental: "",
        others: "",
        primary: "",
        secondary: "",
        tertiary: "",
      }

    if (validate()) {

      createPatient(
        { ...submitData },
      {
        onSuccess: async (v) => {
          queryClient.refetchQueries(API_ENDPOINTS.PATIENT_LIST);
          resetState();
          onCloseForm();
            toast.success(v?.data?.message || "Patient Added Successfully", {
              duration: 2000,
            });
        },
        onError : (error) => {
          queryClient.refetchQueries(API_ENDPOINTS.PATIENT_LIST);
          // onCloseForm()
          resetState();
          onCloseForm();
          console.log(error, "ERROR")
          toast.error(error?.response?.data?.message, { duration: 3000 });
        },
      }
    );
  }
  };

  const resetState = () => {
    reset()
    setRelationShip({})
    setInsurancePayer({})
    setPrimaryProvider({})
    setAppRenderingProvider({})
    setProcedureCode({})
    setProcedureType({})

  }

  const validate = () => {
    if (!relationShip?.value) {
        setRelationShip({error : 'Please select an option.'});
    }
    if (!insurancePayer?.value) {
      setInsurancePayer({error : 'Please select an option.'});
    }
    if (!primaryProvider?.value) {
      setPrimaryProvider({error : 'Please select an option.'});
    }
    if (!relationShip?.value || !insurancePayer?.value || !primaryProvider?.value) {
        return false;
      }
  
      return true;
}

  const SelectedRelationship = async (selectData) => {
    setRelationShip(selectData);
    setValue("relationship", selectData?.value);
  };
  const SelectedInsurancePayer = async (selectData) => {
    setInsurancePayer(selectData);
    setValue("insurancePayer", selectData?.value);
  };
  const SelectedPrimaryProvider = async (selectData) => {
    setPrimaryProvider(selectData);
    setValue("primaryProvider", selectData?.value);
  };

  const SelectedAppointmentRenderingProvider = async (selectData) => {
    setAppRenderingProvider(selectData);
    setValue("appointmentRenderingProvider", selectData?.value);
  };
  const SelectedProcedureCode = async (selectData) => {
    setProcedureCode(selectData);
    setValue("procedureCode", selectData?.value);
  };
  const SelectedProcedureType = async (selectData) => {
    setProcedureType(selectData);
    setValue("procedureType", selectData?.value);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={toggleModalOpen}
        startIcon={<FontAwesomeIcon icon={faPlus} />}
      >
        New
      </Button>
      <Dialog open={open} onClose={toggleModalClose} fullWidth maxWidth="md">
        <DialogTitle>Manual Verification</DialogTitle>
        <DialogActions>
                <QRModal 
                onSuccess={(data) => {
                    const name = data
                    ?.find((singleRecord) =>
                        singleRecord.Key.toLowerCase().includes("name")
                    )
                    ?.Value?.split(" ");

                    const firstName = name?.[0];
                    const lastName = name?.[1];

                    resetField("firstName", {
                    defaultValue: firstName ?? (""),
                    });
                    resetField("lastName", {
                    defaultValue: lastName ?? (""),
                    });

                    const memberId = data?.find(
                    (singleRecord) => singleRecord.Key === "memberId"
                    )?.Value;
                    resetField("memberId", {
                    defaultValue: memberId ?? "",
                    });
                    const GroupId = data?.find(
                    (singleRecord) => singleRecord.Key === "groupId"
                    )?.Value;
                    resetField("GroupId", {
                    defaultValue: GroupId ?? "",
                    });
                    const dateOfBirth = data?.find(
                    (singleRecord) => singleRecord.Key === "dateOfBirth"
                    )?.Value;
                    resetField("dateOfBirth", {
                    defaultValue:
                        dateOfBirth !== undefined ? new Date(dateOfBirth) : null,
                    });
                }} />
                <UploadModal 
                onSuccess={(data) => {
                  const name = data
                    ?.find((singleRecord) =>
                      singleRecord.Key.toLowerCase().includes("name")
                    )
                    ?.Value?.split(" ");

                  const firstName = name?.[0];
                  const lastName = name?.[1];
                  resetField("firstName", {
                    defaultValue: firstName ?? "",
                  });
                  resetField("lastName", {
                    defaultValue: lastName ?? "",
                  });

                  // const gender = data
                  //   ?.find((singleRecord) => singleRecord.Key === "gender")
                  //   ?.Value.toLowerCase();
                  // resetField("gender", {
                  //   defaultValue: gender ?? "",
                  // });
                  const memberId = data?.find(
                    (singleRecord) => singleRecord.Key === "memberId"
                  )?.Value;
                  resetField("memberId", {
                    defaultValue: memberId ?? "",
                  });
                  const GroupId = data?.find(
                    (singleRecord) => singleRecord.Key === "groupId"
                  )?.Value;
                  resetField("GroupId", {
                    defaultValue: GroupId ?? "",
                  });
                  const dateOfBirth = data?.find(
                    (singleRecord) => singleRecord.Key === "dateOfBirth"
                  )?.Value;
                  resetField("dateOfBirth", {
                    defaultValue:
                      dateOfBirth !== undefined ? new Date(dateOfBirth) : null,
                  });
                }}
                />
              <Button onClick={toggleModalClose} variant='outlined' color="secondary">
                Cancel
              </Button> 
              {isLoading ? <CircularProgress size={"30px"} /> :
              <ConfirmationModal
                onClick={handleSubmit(onSubmit)}
                value="Submit"
              />}
            </DialogActions>
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
                Subscriber Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="Relationship"
                    >
                      First Name
                    </InputLabel>
                  <TextField
                    fullWidth
                    // label="First Name"
                    size="small"
                    {...register("firstName")}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                  {/* <FormHelperText sx={{ color: "error.main" }}>
                    {errors && errors.firstName && errors.firstName.message && (
                      <Typography>{errors.firstName.message}</Typography>
                    )}
                    </FormHelperText> */}
                </Grid>
                <Grid item xs={12} md={4}>
                <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="Relationship"
                    >
                      Last Name
                    </InputLabel>
                  <TextField
                  size="small"
                    fullWidth
                    {...register("lastName")}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                    <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="Relationship"
                    >
                      Date Of Birth
                    </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("dateOfBirth")}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="Relationship"
                    >
                      Member ID
                    </InputLabel>
                  <TextField
                    size="small"
                    fullWidth
                    {...register("memberId")}
                  />
                </Grid>
                <Grid item xs={12} md={4} sx={{marginBottom: "-25px"}}>
                  <Box sx={{ mb: 5 }}>
                    <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="InsurancePayer"
                    >
                      Insurance Payer
                    </InputLabel>
                    <Select
                      name="code"
                      closeMenuOnSelect={1}
                      className="capitalize rounded-[5px]"
                      id="code"
                      isLoading={insurancePayerLoading}
                      onChange={SelectedInsurancePayer}
                      value={
                        insurancePayer.value
                          ? { label: insurancePayer?.label, value: insurancePayer?.value }
                          : null
                      }
                      options={insurancePayerList?.PayerList?.map((v) => ({
                        label: `${v?.PayerName}`,
                        value: v?.PayerId
                      }))}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        menu: (base) => ({
                          ...base,
                          width: '400px', // Adjust the width of the menu
                        }),
                      }}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                    {/* <FormHelperText sx={{ color: "#ff0505" }}>
                      {seletedCountry?.error}
                    </FormHelperText> */}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{marginBottom: "-25px"}}>
                  <Box sx={{ mb: 5 }}>
                    <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="Relationship"
                    >
                      Relationship
                    </InputLabel>
                    <Select
                      name="code"
                      closeMenuOnSelect={1}
                      className="capitalize rounded-[5px]"
                      id="code"
                      onChange={SelectedRelationship}
                      value={
                        relationShip.value
                          ? { label: relationShip?.label, value: relationShip?.value }
                          : null
                      }
                      options={relationshipTypes?.map((v) => ({
                        label: `${v?.label}`,
                        value: v?.value
                      }))}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        menu: (base) => ({
                          ...base,
                          width: '250px', // Adjust the width of the menu
                        }),
                      }}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                    {/* <FormHelperText sx={{ color: "#ff0505" }}>
                      {seletedCountry?.error}
                    </FormHelperText> */}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{marginBottom: "-25px"}}>
                  <Box sx={{ mb: 2}}>
                    <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="InsurancePayer"
                    >
                      Primary Provider
                    </InputLabel>
                    <Select
                      name="primaryProvider"
                      closeMenuOnSelect={1}
                      className="capitalize rounded-[5px]"
                      id="primaryProvider"
                      isLoading = {providerLoading}
                      onChange={SelectedPrimaryProvider}
                      value={
                        primaryProvider.value
                          ? { label: primaryProvider?.label, value: primaryProvider?.value }
                          : null
                      }
                      options={providerdataResp?.data?.map((v) => ({
                        label: `${v?.providerOption}`,
                        value: v?.uniqueId
                      }))}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        menu: (base) => ({
                          ...base,
                          width: '400px', // Adjust the width of the menu
                        }),
                      }}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                    {/* <FormHelperText sx={{ color: "#ff0505" }}>
                      {seletedCountry?.error}
                    </FormHelperText> */}
                  </Box>
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="end" alignItems="center">
                <Typography variant="h6">Additional Information</Typography>
                <Switch
                  color="primary"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />
              </Box>
              {checked && (
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={4}>
                  <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="TypeOfService"
                    >
                      Type Of Service
                    </InputLabel>
                    <TextField
                        size="small"
                      fullWidth
                      {...register("typeOfService")}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                  <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="PracticeName&Location"
                    >
                        Practice Name & Location
                    </InputLabel>
                    <TextField
                        size="small"
                      fullWidth
                      {...register("practiceNameAndLocation")}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                  <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="AppointmentType"
                    >
                        Appointment Type
                    </InputLabel>
                    <TextField
                        size="small"
                      fullWidth
                      {...register("appointmentType")}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="ScheduleAppointment"
                    >
                      Schedule Appointment
                    </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("scheduleAppointment")}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="Speciality"
                    >
                        Speciality
                    </InputLabel>
                    <TextField
                        size="small"
                      fullWidth
                      {...register("Speciality")}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                  <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="GroupId"
                    >
                        Group Id
                    </InputLabel>
                    <TextField
                        size="small"
                      fullWidth
                      {...register("GroupId")}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} sx={{marginBottom: "-25px"}}>
                  <Box sx={{ mb: 5 }}>
                    <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="AppointmentRenderingProvider"
                    >
                      Appointment Rendering Provider
                    </InputLabel>
                    <Select
                      name="code"
                      closeMenuOnSelect={1}
                      className="capitalize rounded-[5px]"
                      id="code"
                      onChange={SelectedAppointmentRenderingProvider}
                      value={
                        appRenderingProvider.value
                          ? { label: appRenderingProvider?.label, value: appRenderingProvider?.value }
                          : null
                      }
                      options={appointmentRenderingProviders?.map((v) => ({
                        label: `${v?.label}`,
                        value: v?.value
                      }))}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        menu: (base) => ({
                          ...base,
                          width: '250px', // Adjust the width of the menu
                        }),
                      }}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                    {/* <FormHelperText sx={{ color: "#ff0505" }}>
                      {seletedCountry?.error}
                    </FormHelperText> */}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{marginBottom: "-25px"}}>
                  <Box sx={{ mb: 5 }}>
                    <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="Procedure Code"
                    >
                      Procedure Code
                    </InputLabel>
                    <Select
                      name="code"
                      closeMenuOnSelect={1}
                      className="capitalize rounded-[5px]"
                      id="code"
                      isLoading = {procedureCodeLoading}
                      onChange={SelectedProcedureCode}
                      value={
                        procedureCode.value
                          ? { label: procedureCode?.label, value: procedureCode?.value }
                          : null
                      }
                      options={procedureCodeList?.data?.map((v) => ({
                        label: `${v?.procedureCode}`,
                        value: v?.procedureCode
                      }))}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        menu: (base) => ({
                          ...base,
                          width: '250px', // Adjust the width of the menu
                        }),
                      }}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                    {/* <FormHelperText sx={{ color: "#ff0505" }}>
                      {seletedCountry?.error}
                    </FormHelperText> */}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{marginBottom: "-25px"}}>
                  <Box sx={{ mb: 5 }}>
                    <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="ProcedureType"
                    >
                      Procedure Type
                    </InputLabel>
                    <Select
                      name="code"
                      closeMenuOnSelect={1}
                      className="capitalize rounded-[5px]"
                      id="code"
                      isLoading = {procedureTypeLoading}
                      onChange={SelectedProcedureType}
                      value={
                        procedureType.value
                          ? { label: procedureType?.label, value: procedureType?.value }
                          : null
                      }
                      options={procedureTypeList?.data?.map((v) => ({
                        label: `${v}`,
                        value: v
                      }))}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        menu: (base) => ({
                          ...base,
                          width: '250px', // Adjust the width of the menu
                        }),
                      }}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                    {/* <FormHelperText sx={{ color: "#ff0505" }}>
                      {seletedCountry?.error}
                    </FormHelperText> */}
                  </Box>
                </Grid>
                </Grid>
              )}

              <Divider sx={{mt: 2}}/>

              {relationShip?.value !== "18" && (<><Typography sx={{mt: 2}} variant="h6" gutterBottom>
                Dependent Details-Patient Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="FirstName"
                    >
                      First Name
                    </InputLabel>
                  <TextField
                    fullWidth
                    // label="First Name"
                    size="small"
                    {...register("dependentFirstName")}
                  />
                  {/* <FormHelperText sx={{ color: "error.main" }}>
                    {errors && errors.firstName && errors.firstName.message && (
                      <Typography>{errors.firstName.message}</Typography>
                    )}
                    </FormHelperText> */}
                </Grid>
                <Grid item xs={12} md={4}>
                <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="LastName"
                    >
                      Last Name
                    </InputLabel>
                  <TextField
                  size="small"
                    fullWidth
                    {...register("dependentLastName")}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                    <InputLabel
                      sx={{
                        color: "#000000",
                        mb: 0,
                        fontSize: "14px",
                        pb: 1,
                      }}
                      htmlFor="DateOfBirth"
                    >
                      Date Of Birth
                    </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("dependentDateOfBirth")}
                  />
                </Grid>
                </Grid></>)}
            </DialogContent>
          </form>
      </Dialog>
    </>
  );
};

export default EligibilityModal;
