import React from "react";
import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Box,
  Grid,
  Link,
  Checkbox,
  FormControlLabel,
  FormLabel,
  FormGroup,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEye,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import BenefitReport from "src/sections/eligibility/patientBenefit/report";
import { Menu } from "@mui/material";
import { useParams } from "react-router-dom";
import { usePatientBenefitListdetailsQuery, usePatientGetBasicReportMutation, usePatientGetReportMutation } from "src/framework/rest/eligibility/eligibility.query";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

const FiltersFormSchema = z.object({
  inNetwork: z.boolean().optional(),
  outNetwork: z.boolean().optional(),
  adaCode: z.boolean().optional(),
  search: z.string().optional(),
  pastHistory: z.string().optional(),
});

const PatientBenefitInformationReport = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {param} = useParams();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const methods = useForm({
    resolver: zodResolver(FiltersFormSchema),
  });

  const { handleSubmit } = methods;
  const { mutate: getReport, isLoading } = usePatientGetReportMutation();
  const { mutate: getBasicReport, isLoading: basicIsLoading } = usePatientGetBasicReportMutation();
  const { mutate: getDetailedReport, isLoading: detailIsLoading } = usePatientGetBasicReportMutation();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  const { data: Result, isLoading: loader } = usePatientBenefitListdetailsQuery({
    "PatientId": param,
    "Category": "",
    "AdaCode": [""]
});

const patient = Result?.Result?.PatientDetails || {}

  const handleReportDownload = () => {
    getReport({ 
    "PatientId":param,
    "ADACode":"",
    "CoveragePer":""
     },
      {
          onSuccess: async (v) => {
            try {
              const response = await fetch(`${import.meta.env.VITE_ELIGIBILITY_PATIENT_URL}/${v?.data?.pdfUrl}`, {
                  method: 'GET',
              });
      
              if (!response.ok) {
                  throw new Error('Failed to fetch the file.');
              }
      
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              
              // Create a link element and trigger download
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'patient Preference report.pdf'); // Specify file name
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
      
              // Revoke object URL to free memory
              URL.revokeObjectURL(url);
      
              // Show success toast
              toast.success('Download started successfully!', {
                  duration: 2000,
              });
          } catch (error) {
              console.error('Error downloading PDF:', error);
              toast.error('Failed to download the file. Please try again.');
          }
          },
          onError: (error) => {
              console.log(error, "ERROR")
              toast.error(error?.response?.data?.message, { duration: 3000 });
          },
      }
  );
  }

  const handleBasicReportDownload = () => {
    getBasicReport({ 
    "patientId": param,
    "eligibilityId": patient?.eligibilityId || "",
    "basicReport": true
     },
      {
          onSuccess: async (v) => {
            try {
              const response = await fetch(`${import.meta.env.VITE_ELIGIBILITY_PATIENT_URL}/${v?.data?.pdfUrl}`, {
                  method: 'GET',
              });
      
              if (!response.ok) {
                  throw new Error('Failed to fetch the file.');
              }
      
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              
              // Create a link element and trigger download
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'Basic report.pdf'); // Specify file name
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
      
              // Revoke object URL to free memory
              URL.revokeObjectURL(url);
      
              // Show success toast
              toast.success('Download started successfully!', {
                  duration: 2000,
              });
          } catch (error) {
              console.error('Error downloading PDF:', error);
              toast.error('Failed to download the file. Please try again.');
          }
          },
          onError: (error) => {
              console.log(error, "ERROR")
              toast.error(error?.response?.data?.message, { duration: 3000 });
          },
      }
  );
  }

  const handleDetailedReportDownload = () => {
    getDetailedReport({ 
    "patientId": param,
    "eligibilityId": patient?.eligibilityId || "",
    "basicReport": false
     },
      {
          onSuccess: async (v) => {
            try {
              const response = await fetch(`${import.meta.env.VITE_ELIGIBILITY_PATIENT_URL}/${v?.data?.pdfUrl}`, {
                  method: 'GET',
              });
      
              if (!response.ok) {
                  throw new Error('Failed to fetch the file.');
              }
      
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              
              // Create a link element and trigger download
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'Detailed report.pdf'); // Specify file name
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
      
              // Revoke object URL to free memory
              URL.revokeObjectURL(url);
      
              // Show success toast
              toast.success('Download started successfully!', {
                  duration: 2000,
              });
          } catch (error) {
              console.error('Error downloading PDF:', error);
              toast.error('Failed to download the file. Please try again.');
          }
          },
          onError: (error) => {
              console.log(error, "ERROR")
              toast.error(error?.response?.data?.message, { duration: 3000 });
          },
      }
  );
  }

  return (
    <Box>
      <Box className="" style={{background: "linear-gradient(to top, #007BED 0%, #C350EC 97.19%)", height: 60, color: "#fff"}}>
          <Typography variant="h5" p={2}> Patient Benefit Information -{" "}
          {`${
            patient?.relationship === "18"
              ? patient?.FirstName
              : patient?.FirstName
          } ${
            patient?.relationship === "18"
              ? patient?.LastName
              : patient?.LastName
            }`}</Typography>
        </Box>
    
    <Box p={2}>
      {/* Filters Section */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ marginY: 2, padding: 2, borderRadius: "8px" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel
                sx={{
                  color: "#000000",
                  mb: 0,
                  fontSize: "14px",
                  pb: 1,
                }}
                htmlFor="Relationship"
              >
                Benefits
              </InputLabel>
              <TextField
                size="small"
                type="date"
                // fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6} md={2}>
              <Typography>ADA Code Filter</Typography>
              <Switch {...methods.register("adaCode")} />
            </Grid> */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <FormLabel component="legend">Network Filter</FormLabel>
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} label="In Network" />
                  <FormControlLabel control={<Checkbox />} label="Out Of Network" />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    color: "#000000",
                    mb: 0,
                    fontSize: "14px",
                    pb: 1,
                  }}
                  htmlFor="Relationship"
                >
                  Past Benefit History
                </InputLabel>
                <Select defaultValue="" size="small">
                  <MenuItem value="Benefit Summary On">
                    Benefit Summary On
                  </MenuItem>
                  <MenuItem value="Benefit Summary Off">
                    Benefit Summary Off
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ marginY: 2, display: "flex", justifyContent: 'end', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<FontAwesomeIcon icon={faDownload} />}
                  sx={{ textTransform: "none", color: "#673AB7", borderColor: "#673AB7" }}
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  PDF
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleBasicReportDownload}>
                  {!basicIsLoading ? 'Basic Report' : <CircularProgress size="30px" /> }
                  </MenuItem>
                  <MenuItem onClick={handleReportDownload}>
                  {!isLoading ? 'Patient Preference Report' : <CircularProgress size="30px" /> }
                  </MenuItem>
                  <MenuItem onClick={handleDetailedReportDownload}>
                  {!detailIsLoading ? 'Detailed Report' : <CircularProgress size="30px" /> }
                  </MenuItem>
                </Menu>
                <Button
                  variant="outlined"
                  startIcon={<FontAwesomeIcon icon={faEye} />}
                  sx={{ textTransform: "none", color: "#673AB7", borderColor: "#673AB7" }}
                >
                  Preview
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </form>
        <BenefitReport Result = {Result} loader = {loader}/>
    </Box>
    </Box>
  );
};

export default PatientBenefitInformationReport;