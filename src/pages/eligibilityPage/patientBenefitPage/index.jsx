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
  Menu,
  CircularProgress,
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
import PatientBenefitInformationTabs from "src/sections/eligibility/patientBenefit/patientBenefitTables";
import { usePatientDetailQuery, usePatientGetBasicReportMutation, usePatientGetReportMutation } from "src/framework/rest/eligibility/eligibility.query";
import { useParams } from "react-router-dom";
import { fDate } from "src/utils/format-time";
import toast from "react-hot-toast";

const FiltersFormSchema = z.object({
  inNetwork: z.boolean().optional(),
  outNetwork: z.boolean().optional(),
  adaCode: z.boolean().optional(),
  search: z.string().optional(),
  pastHistory: z.string().optional(),
});

const PatientBenefitInformationNew = () => {
  const {param} = useParams();

  const [anchorEl, setAnchorEl] = React.useState(null);
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

  const { mutate: getReport, isLoading } = usePatientGetReportMutation();
  const { mutate: getBasicReport, isLoading: basicIsLoading } = usePatientGetBasicReportMutation();

  const { handleSubmit } = methods;

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

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
              link.setAttribute('download', 'report.pdf'); // Specify file name
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

  const {data} = usePatientDetailQuery({PatientId : param})

  const patient = data?.BenifitDetails[0] || {}

  const handleBasicReportDownload = () => {
    getBasicReport({ 
    "patientId": param,
    "eligibilityId": patient?.eligibilityid || "",
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
              link.setAttribute('download', 'report.pdf'); // Specify file name
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
              ? patient?.firstName
              : patient?.dependentFirstName
          } ${
            patient?.relationship === "18"
              ? patient?.lastName
              : patient?.dependentLastName
            } (${patient?.patientId})`}</Typography>
        </Box>
    
    <Box p={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search content"
          variant="outlined"
          size="small"
          sx={{ width: "300px" }}
        />
      </Box>

      {/* Filters Section */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ marginY: 2, padding: 2, borderRadius: "8px" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
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
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography>ADA Code Filter</Typography>
              <Switch {...methods.register("adaCode")} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
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
                  {!isLoading ? 'Patient Report' : <CircularProgress size="30px" /> }
                  </MenuItem>
                  <MenuItem onClick={handleClose}>Detailed Report</MenuItem>
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

      {/* Subscriber Information Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Card
            sx={{
              marginY: 2,
              padding: 2,
              backgroundColor: "#F3E8FF",
              borderRadius: "8px",
              border: "1px solid #D1C4E9",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#673AB7", fontWeight: "bold" }}
                >
                  Subscriber Information
                </Typography>
                <Divider sx={{ marginY: 1 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" gutterBottom sx={{ pb: 2 }}>
                      <Typography className='text-[#999999]'>First Name</Typography> {patient?.firstName}
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ pb: 2 }}>
                      <Typography className='text-[#999999]'>Last Name</Typography> {patient?.lastName}
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ pb: 2 }}>
                      <Typography className='text-[#999999]'>DOB</Typography> {fDate(patient?.dateOfBirth)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" gutterBottom sx={{ pb: 2 }}>
                      <Typography className='text-[#999999]'>Gender</Typography> {patient?.gender || "-"}
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ pb: 2 }}>
                      <Typography className='text-[#999999]'>Relationship</Typography> {patient?.relationship}
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ pb: 2 }}>
                      <Typography className='text-[#999999]'>Member ID/Medicaid ID</Typography> {patient?.memberId}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#673AB7", fontWeight: "bold" }}
                  >
                    Coverage
                  </Typography>
                  <Button
                    variant="text"
                    startIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                    sx={{ color: "#673AB7", height: 10 }}
                  >
                    Edit
                  </Button>
                </Box>
                <Divider sx={{ marginY: 1 }} />
                <Typography variant="body1" gutterBottom sx={{ pb: 2 }}>
                      <Typography className='text-[#999999]'>Effective Date</Typography> {fDate(patient?.effectiveEndDate)}
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ pb: 2 }}>
                      <Typography className='text-[#999999]'>statusflag</Typography> {patient?.Status}
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ pb: 2 }}>
                      <Typography className='text-[#999999]'>Insurance Name</Typography> {patient?.insurancePayer}
                    </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Summary Section */}
        <Grid item xs={12} sm={4} mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ padding: 2, textAlign: "center", borderRadius: "8px" , height: 100}}>
                <Typography variant="subtitle2">Dental Coverage</Typography>
                {patient?.Status == "Active" ? <Typography variant="h6" color="success.main">
                  {patient?.Status}
                </Typography> : <Typography variant="h6" color="error.main">
                  {patient?.Status}
                </Typography> }
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ padding: 2, textAlign: "center", borderRadius: "8px", height: 100 }}>
                <Typography variant="subtitle2">Remaining Benefits</Typography>
                <Link
                  href="#"
                  sx={{ textDecoration: "none", color: "#673AB7", fontWeight: "bold" }}
                >
                  Varies
                </Link>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ padding: 2, textAlign: "center", borderRadius: "8px", height: 100 }}>
                <Typography variant="subtitle2">Last Verified</Typography>
                <Typography variant="h6">{fDate(patient?.lastVerified)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {/* 6 days ago */}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ padding: 2, textAlign: "center", borderRadius: "8px", height: 100 }}>
                <Typography variant="subtitle2">Deductible Remaining</Typography>
                {/* <Typography variant="h6">$50.00</Typography> */}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <PatientBenefitInformationTabs />
    </Box>
    </Box>
  );
};

export default PatientBenefitInformationNew;