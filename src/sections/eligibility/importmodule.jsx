import React from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAws, faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRotateRight,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import CSVFileValidator from "csv-file-validator";
import { isEmpty } from "lodash";
import toast from "react-hot-toast";
import moment from "moment";
// import { toast } from "react-toastify";
// import "./eligibility.module.scss";

export const ImportModal = (props) => {
  const [file, setFile] = React.useState(null);
  const [csvError, setCsvError] = React.useState([]);
  const [csvUploadData, setCsvUploadData] = React.useState([]);
  const [storageOption, setStorageOption] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const methods = useForm();

  const toggleDialog = () => {
    setOpen(!open);
    setFile(null);
  };

  const onSubmit = async () => {
    try {
      if (!file) return;
      const url = import.meta.env.VITE_ELIGIBILITY_PATIENT_URL;
      const response = await axios.post(url + "/patients/csv/upload", {
        patientsData: csvUploadData,
      });
      toast.success(response.data.msg);
      setFile(null);
      // toggleDialog();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Upload failed");
      setCsvError(error?.response?.data?.error || []);
    }
  };

  const downloadSampleCsv = async () => {
    const fileName = "Patient_upload_template";
    const url = import.meta.env.VITE_ELIGIBILITY_PATIENT_URL;
    const response = await axios.get(url + "/patients/downloadsamplecsv");
    const file = new Blob([response.data], { type: "text/csv" });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", `${fileName}`);
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(fileURL);
    document.body.removeChild(link);
  };

  const templateCSVHeader = [
    { label: "First name*", key: "subscriberFirstName" },
    { label: "Last name*", key: "subscriberLastName" },
    { label: "Date of Birth*", key: "subscriberDateOfBirth" },
    { label: "Member ID/Medicaid ID*", key: "memberId" },
    { label: "Group ID*", key: "groupId" },
    { label: "Relationship*", key: "relationship" },
    { label: "Type Of Service", key: "typeOfService" },
    { label: "Practice name & Location", key: "practiceNameAndLoc" },
    { label: "Appointment Type", key: "appointmentType" },
    { label: "Appointment Date", key: "scheduleAppointment" },
    { label: "Specialty", key: "speciality" },
    { label: "Gender*", key: "gender" },
    {
      label: "Appointment Rendering Provider",
      key: "appointmentRenderingProvider",
    },
    { label: "Type of Insurance*", key: "insuranceType" },
    { label: "Procedure Type*", key: "procedureType" },
    { label: "Procedure Code*", key: "procedureCode" },
    { label: "Primary Provider", key: "provider" },
    { label: "Provider NPI ID*", key: "providerNpi" },
    { label: "Insurance Payer*", key: "insurancePayer" },
    { label: "Payer ID*", key: "payerIdCode" },
    { label: "First Name*", key: "dependentFirstName" },
    { label: "Last Name*", key: "dependentLastName" },
    { label: "Date of Birth*", key: "dependentDateOfBirth" },
  ];

  const headerConfig = () => {
    const resultArr = [];
    templateCSVHeader.forEach((item) => {
      const obj = {
        name: item.label,
        inputName: item.key,
        required: [
          "groupId",
          "memberId",
          "subscriberFirstName",
          "subscriberLastName",
          "subscriberDateOfBirth",
          "relationship",
          "gender",
          "insurancePayer",
          "providerNpi",
          "payerIdCode",
          "dependentFirstName",
          "dependentLastName",
          "dependentDateOfBirth",
          "insuranceType",
          "procedureCode",
          "procedureType",
        ].includes(item.key),
        validate: function (value) {
          if (
            [
              "scheduleAppointment",
              "subscriberDateOfBirth",
              "dependentDateOfBirth",
            ].includes(item.key)
          ) {
            const date = value.trimEnd();
            const isValidDate = moment(date, "MM-DD-YYYY", true).isValid();
            return isValidDate;
          } else return true;
        },
        validateError: function (
          headerName,
          rowNumber,
          columnNumber
        ) {
          return `${headerName} in row ${rowNumber} / column ${columnNumber} should be "MM-DD-YYYY" format.`;
        },
        requiredError: function (
          headerName,
          rowNumber,
          columnNumber
        ) {
          return `${headerName} is required in the row ${rowNumber} / column ${columnNumber} `;
        },
      };
      resultArr.push(obj);
    });
    return resultArr;
  };

  const csvHeaderConfig = headerConfig();

  const handleCsvValidation = (file) => {
    const config = {
      headers: csvHeaderConfig,
      isHeaderNameOptional: false,
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        const rows = text.split(/\r?\n/).slice(1).filter((row) => row.trim());
        try {
          const res = await CSVFileValidator(rows.join("\n"), config);
          setCsvUploadData(res.data);
          setCsvError(res.inValidData);
        } catch (error) {
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
  };

  const errorContent = () => (
    <Box>
      <Typography color="error" variant="subtitle1" align="center">
        {csvError.length} Errors Found
      </Typography>
      <Box mt={2}>
        {csvError.map((item, index) => (
          <Typography key={index} color="error">
            {index + 1}. {item?.message || "Unknown error"}
          </Typography>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <Button variant="outlined" color="primary" onClick={toggleDialog}>
        Import
      </Button>

      <Dialog open={open} maxWidth="lg" fullWidth>
        <DialogTitle>Import</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <DialogContent>
              {!file ? (
                <Box>
                  <Button onClick={downloadSampleCsv}>
                    Download sample template
                  </Button>

                  <Card
                    sx={{
                      border: "2px dashed #06AB89",
                      bgcolor: "primary.light",
                      p: 3,
                      mt: 2,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <label htmlFor="csv-upload" style={{ cursor: "pointer" }}>
                      <FontAwesomeIcon icon={faUpload} />
                      <Typography>Upload CSV</Typography>
                    </label>
                    <Input
                      id="csv-upload"
                      type="file"
                      sx={{ display: "none", width: '100%' }}
                      inputProps={{ accept: ".csv" }}
                      onChange={(e) => {
                        const acceptedFile = e.target.files?.[0];
                        setFile(acceptedFile || null);
                        if (acceptedFile) handleCsvValidation(acceptedFile);
                      }}
                    />
                  </Card>

                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Select
                      value={storageOption}
                      onChange={(e) => setStorageOption(e.target.value)}
                      displayEmpty
                      inputProps={{ "aria-label": "Select storage option" }}
                    >
                      <MenuItem value="" disabled>
                        Select Storage Option
                      </MenuItem>
                      <MenuItem value="gdrive">
                        <FontAwesomeIcon icon={faGoogleDrive} /> Google Drive
                      </MenuItem>
                      <MenuItem value="s3">
                        <FontAwesomeIcon icon={faAws} /> AWS S3 Bucket
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6">{file.name}</Typography>
                  <Typography variant="body2">{file.size} bytes</Typography>
                  {csvUploadData.length > 0 && !csvError.length ? (
                    <Typography color="success.main">
                      {csvUploadData.length} data rows ready for upload!
                    </Typography>
                  ) : (
                    <Typography color="error">
                      Invalid or empty CSV file.
                    </Typography>
                  )}
                  {!isEmpty(csvError) && errorContent()}
                  <Button
                    startIcon={<FontAwesomeIcon icon={faTrash} />}
                    color="error"
                    onClick={() => setFile(null)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={toggleDialog}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                disabled={csvError.length > 0 || !csvUploadData.length}
                type="submit"
              >
                Upload
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </>
  );
};

export default ImportModal;
