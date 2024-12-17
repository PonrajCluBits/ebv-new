import {React,useState,useEffect} from 'react'
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
/* import CardActions from '@mui/material/CardActions'; */
import CardContent from '@mui/material/CardContent';
/* import Button from '@mui/material/Button'; */
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
/* import InputLabel from '@mui/material/InputLabel'; */
import styles from './styles.module.css';
import OverAllCountByYear from './OverAllCountByYear';
import OverAllCountByMonth from './OverAllCountByMonth';
import OverAllCountByDay from './OverAllCountByDay';
import DonutChart from './DonutChart';

import * as XLSX from 'xlsx'; // Import xlsx for exporting
import PayerWise from './PayerWise';
import { CircularProgress, Alert, Snackbar } from '@mui/material';
import { useQuery } from "react-query";
import { fetchUsers } from "./FetchContext"; 


const PatientData = () => {

  const [selectedFromDate, setSelectedFromDate] = useState(dayjs('2024-10-01')); 
  const [selectedToDate, setSelectedToDate] = useState(dayjs());
  const [selectProvider,setSelectProvider] = useState('');
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [selectPatientID,setSelectPatientID] = useState('');
  const [PayerFlagDetails, setPayerFlagDetails] = useState([]);

  const { data: dashboardData, error, isLoading } = useQuery(
    'dashboardData', // Unique query key
    fetchUsers // Function that fetches data
  );
    // Show loading button until data is fetched
    if (isLoading) {
      return (
        <div className={styles.loadingcontainer}>
          <button className={styles.loadingbutton}>
            <span className={styles.spinner}></span> Loading...
          </button>
        </div>
      );
    }

  // Display error message if there is an error
  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }
 

  const FilteredDetail = Array.isArray(dashboardData?.data) && dashboardData?.data.length > 0 
  ? dashboardData?.data
      .filter(item => {
        // Dynamically check each filter condition (Company, Location, Date range)
        const providerMatch = !selectProvider || item?.providerNpi === selectProvider
        const patientIDMatch = !selectPatientID || item?.patientId === selectPatientID
        const fromDateMatch = !selectedFromDate || dayjs(item?.createdAt).format("YYYY-MM-DD") >= dayjs(selectedFromDate).format("YYYY-MM-DD");
        const toDateMatch = !selectedToDate || dayjs(item?.createdAt).format("YYYY-MM-DD") <= dayjs(selectedToDate).format("YYYY-MM-DD");
    
        // Return true if both fromDate and toDate match the condition
        return providerMatch && patientIDMatch && fromDateMatch && toDateMatch;
      })
      .map(item => ({
        patientId: item.patientId,
        payerIdCode: item.payerIdCode,
        YTD: item.patientId,  // This seems to be just the patientId; change if needed
        providerNpi: item.providerNpi,
        isverifiedStatus: item.isverifiedStatus,
        Activeinactivestatus: item.Activeinactivestatus,
        PayerFlag:item.PayerFlag,
        Groupname:item.Groupname,
        createdAt: dayjs(item.createdAt).format("YYYY-MM-DD"),
      }))
      .reduce((acc, item) => {
        // Add only unique values based on `patientId`, `payerIdCode`, `YTD`, and `provider`
        if (!acc.some(existingItem => existingItem.patientId === item.patientId)) {
          acc.push(item);
        }
        return acc;
      }, [])
  : [];  // If dashboardData is undefined or null, return an empty array

 

  const uniquePatientId = FilteredDetail ? [...new Set(FilteredDetail.map((item)=> item.patientId))]:[]
  const uniquePayerIdCode = FilteredDetail ? [...new Set(FilteredDetail.map((item)=> item.payerIdCode))]:[]
 
  const uniqueProvider = FilteredDetail ? [...new Set(FilteredDetail.map((item)=> item.providerNpi))]:[]
 
  


  const PayerFlagPayerIdCode = PayerFlagDetails ? [...new Set(PayerFlagDetails.map((item)=> item.payerIdCode))]:[]
  const PayerFlagProvider = PayerFlagDetails ? [...new Set(PayerFlagDetails.map((item)=> item.providerNpi))]:[]
 
  // Function to update FilteredDetails
  const handleButtonClick = () => {

    // Example of updating FilteredDetails. This could involve fetching new data, 
    // applying filters, or modifying data.
    const updatedDetails = Array.isArray(dashboardData?.data) && dashboardData?.data.length > 0 
  ? dashboardData?.data
      .filter(item => {
        const isInDentalExchange = item?.PayerFlag === 'In Dental Exchange';
        const providerMatch = !selectProvider || item?.providerNpi === selectProvider
        const patientIDMatch = !selectPatientID || item?.patientId === selectPatientID
        const fromDateMatch = !selectedFromDate || dayjs(item?.createdAt).format("YYYY-MM-DD") >= dayjs(selectedFromDate).format("YYYY-MM-DD");
        const toDateMatch = !selectedToDate || dayjs(item?.createdAt).format("YYYY-MM-DD") <= dayjs(selectedToDate).format("YYYY-MM-DD");
    
        // Return true if both fromDate and toDate match the condition
        return isInDentalExchange && providerMatch && patientIDMatch && fromDateMatch && toDateMatch;
      })
      .map(item => ({
        patientId: item.patientId,
        payerIdCode: item.payerIdCode,
        YTD: item.patientId,  // This seems to be just the patientId; change if needed
        providerNpi: item.providerNpi,
        isverifiedStatus: item.isverifiedStatus,
        Activeinactivestatus: item.Activeinactivestatus,
        PayerFlag:item.PayerFlag,
        Groupname:item.Groupname,
        createdAt: dayjs(item.createdAt).format("YYYY-MM-DD"),
      })) .reduce((acc, item) => {
        // Add only unique values based on `patientId`, `payerIdCode`, `YTD`, and `provider`
        if (!acc.some(existingItem => existingItem.patientId === item.patientId)) {
          acc.push(item);
        }
        return acc;
      }, [])
  : [];  // If dashboardData is undefined or null, return an empty array
    // Update state with the new data
    setPayerFlagDetails(updatedDetails);
  /*   setSelectProvider();
    setSelectPatientID(); */
  };

  const handleNonDentalClick = () => {

    // Example of updating FilteredDetails. This could involve fetching new data, 
    // applying filters, or modifying data.
    const updatedDetails = Array.isArray(dashboardData?.data) && dashboardData?.data.length > 0 
  ? dashboardData?.data
      .filter(item => {
        const isInDentalExchange = item?.PayerFlag === 'Not In Dental Exchange';
        const providerMatch = !selectProvider || item?.providerNpi === selectProvider
        const patientIDMatch = !selectPatientID || item?.patientId === selectPatientID
        const fromDateMatch = !selectedFromDate || dayjs(item?.createdAt).format("YYYY-MM-DD") >= dayjs(selectedFromDate).format("YYYY-MM-DD");
        const toDateMatch = !selectedToDate || dayjs(item?.createdAt).format("YYYY-MM-DD") <= dayjs(selectedToDate).format("YYYY-MM-DD");
    
        // Return true if both fromDate and toDate match the condition
        return isInDentalExchange && providerMatch && patientIDMatch && fromDateMatch && toDateMatch;
      })
      .map(item => ({
        patientId: item.patientId,
        payerIdCode: item.payerIdCode,
        YTD: item.patientId,  // This seems to be just the patientId; change if needed
        providerNpi: item.providerNpi,
        isverifiedStatus: item.isverifiedStatus,
        Activeinactivestatus: item.Activeinactivestatus,
        PayerFlag:item.PayerFlag,
        Groupname:item.Groupname,
        createdAt: dayjs(item.createdAt).format("YYYY-MM-DD"),
      })) .reduce((acc, item) => {
        // Add only unique values based on `patientId`, `payerIdCode`, `YTD`, and `provider`
        if (!acc.some(existingItem => existingItem.patientId === item.patientId)) {
          acc.push(item);
        }
        return acc;
      }, [])
  : [];  // If dashboardData is undefined or null, return an empty array
    // Update state with the new data
    setPayerFlagDetails(updatedDetails);
  /*   setSelectProvider();
    setSelectPatientID(); */
  };




  const handleFromDateChange = (newDate) => {
    setSelectedFromDate(newDate);
  };

  const handleToDateChange = (newDate) => {
    setSelectedToDate(newDate);
  };

 const handleSelectProvider = (e)=>{
  const selectedProvider = e.target.value;
    setSelectProvider(selectedProvider);

    // Apply filtering logic based on the selected provider
    // Example: Filter data based on the selected provider
    const newFilteredData = dashboardData.filter(item => 
      selectedProvider === '' || item.provider === selectedProvider
    );

    setFilteredData(newFilteredData);
 }
 
 const handleSelectPatientID = (e)=>{
  setSelectPatientID(e.target.value);
 }


  const Content = [
    { id: 1, name: "No.of PatientId" },
    { id: 2, name: "No of PayerIdCode" },
    { id: 3, name: "Total Transaction YTD" },
    { id: 4, name: "Provider" },
    { id: 5, name: "Passed Verified" },
    { id: 6, name: "Failed Verified" },
    { id: 7, name: "No.Active" },
    { id: 8, name: "No.Inactive" },
  ];

 /*  const getUniquePatientIds = (data) => {
    // Filter and map patient IDs, then create a Set to keep them unique
    return [...new Set(data.filter(item => item.patientId).map(item => item.patientId))];
  }; */

  const patientId =PayerFlagDetails.length > 0 
  ? (PayerFlagDetails ? PayerFlagDetails?.filter(item=>item.patientId).length : 0 ) 
  : (FilteredDetail ? FilteredDetail?.filter(item=>item.patientId).length : 0)

  const PayerIdCode = PayerFlagDetails.length > 0 ? (PayerFlagPayerIdCode ? PayerFlagPayerIdCode.length : 0)
                                                  :  (uniquePayerIdCode ? uniquePayerIdCode.length : 0)

  const YTD = PayerFlagDetails.length > 0 ? (PayerFlagDetails ? PayerFlagDetails?.filter(item=>item.YTD).length : 0 ) 
                                                : (FilteredDetail ? FilteredDetail?.filter(item=>item.YTD).length : 0)

  const Provider =  PayerFlagDetails.length > 0 ? (PayerFlagProvider ? PayerFlagProvider.length : 0)
                                                :  ( uniqueProvider ? uniqueProvider.length : 0 )
    
  const Verified = PayerFlagDetails.length > 0 ? ( PayerFlagDetails ? PayerFlagDetails?.filter(item=>item.isverifiedStatus === "Verified").length : 0) 
                                               : FilteredDetail ? FilteredDetail?.filter(item=>item.isverifiedStatus === "Verified").length : 0     
                                               
const NotVerified = PayerFlagDetails.length > 0 ? ( PayerFlagDetails ? PayerFlagDetails?.filter(item=>item.isverifiedStatus === "NotVerified").length : 0) 
                                               : FilteredDetail ? FilteredDetail?.filter(item=>item.isverifiedStatus === "NotVerified").length : 0                                               
 
const Active = PayerFlagDetails.length > 0 ? ( PayerFlagDetails ? PayerFlagDetails?.filter(item=>item.Activeinactivestatus === "Active").length : 0) 
                                               : FilteredDetail ? FilteredDetail?.filter(item=>item.Activeinactivestatus === "Active").length : 0                                               
 
const Inactive = PayerFlagDetails.length > 0 ? ( PayerFlagDetails ? PayerFlagDetails?.filter(item=>item.Activeinactivestatus === "Inactive").length : 0) 
                                               : FilteredDetail ? FilteredDetail?.filter(item=>item.Activeinactivestatus === "Inactive").length : 0                                               
  
  const ContentValues = [{ id: 1, value:patientId},
    { id: 2, value: PayerIdCode },
    { id: 3, value: YTD},
    { id: 4, value: Provider},
    { id: 5, value: Verified },
    { id: 6, value: NotVerified },
    { id: 7, value: Active  },
    { id: 8, value: Inactive },
  ]

  // Function to export data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(<OverAllCountByYear />); // Convert the data to a worksheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data'); // Append the worksheet to the workbook
    XLSX.writeFile(wb, 'chart_data.xlsx'); // Download the file as Excel
  };

  const handleButtonReset = () => {
    // Reset filter states
    setSelectProvider('');
    setSelectPatientID('');
    setPayerFlagDetails('');
    // Reset filtered data to initial (unfiltered) data
    setFilteredData(FilteredDetail);
  };
  return (
    <div> 
       <Box padding={3}>  
       <Grid container spacing={2}>
  {/* First row: 4 cards + divider */}
  <Grid item xs={12} md={8} container spacing={2} order={{ xs: 2, md: 1 }}>
  {/* Cards */}
  {Content.map((contentItem) => {
    // Find the corresponding value from ContentValues based on the id
    const contentValue = ContentValues.find(valueItem => valueItem.id === contentItem.id);

    return (
      <Grid item xs={6} md={3} key={contentItem.id}>
        <Card className={styles.card} sx={{ minWidth: "100%" }}>
          <CardContent className={styles.content}>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 32 }}
              className={styles.number}
              variant="h3"
            >
              {contentValue ? contentValue.value : "N/A"} {/* Display value from ContentValues */}
            </Typography>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 13 }}
              className={styles.status}
            >
              {contentItem.name} {/* Display name from Content */}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  })} </Grid>

  {/* Divider */}

 {/*  */}

<Grid item xs={12} md={4} container  spacing={1} order={{ xs: 1, md: 2 }}>

<Grid item xs={12} md={6}>
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
  {/*   <InputLabel
      id="demo-simple-select-label"
      sx={{ paddingLeft: 1, fontSize: 16,  fontWeight: 500, width: '100%' }}
    >
      From Date
    </InputLabel> */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%' }}>
        <DesktopDatePicker
          sx={{
            width: '100%',
            '& .MuiInputBase-root': {
              height: '50px',
            },
            '& .MuiInputBase-input': {
              padding: '8px 8px',
              color: 'rgb(93, 93, 93)',
            },
          }}
          value={selectedFromDate}
          onChange={handleFromDateChange}
          inputFormat="YYYY-MM-DD"
        />
      </Box>
    </LocalizationProvider>
  </div>

</Grid>

<Grid item xs={12} md={6}>
<Box sx={{ width: '100%' }}>
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
   {/*  <InputLabel
      id="demo-simple-select-label"
      sx={{ paddingLeft: 1, fontSize: 16, fontWeight: 500, width: '100%' }}
    >
      To Date
    </InputLabel> */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%' }}>
        <DesktopDatePicker
          sx={{
            width: '100%',
            '& .MuiInputBase-root': {
              height: '50px',
            },
            '& .MuiInputBase-input': {
              padding: '8px 8px',
              color: 'rgb(93, 93, 93)',
            },
          }}
          value={selectedToDate}
          onChange={handleToDateChange}
          inputFormat="YYYY-MM-DD"
        />
      </Box>
    </LocalizationProvider>
  </div>

  </Box>
  </Grid>

  <Grid item xs={12} md={12} container justifyContent="center" >
{/*       <Box component="form" sx={{ width: '100%' }} noValidate autoComplete="off"> */}


<TextField
    id="outlined-select-currency"
    label="Provider"
    select
    fullWidth
    sx={{ height: '100%' }}
    value={selectProvider}
    onChange={handleSelectProvider}
  >
   
    {uniqueProvider.map((provider) => (
      <MenuItem key={provider} value={provider}>
        {provider}
      </MenuItem>
    ))}
  </TextField>
  
{/*     </Box> */}

</Grid>
<Grid item container sx={{justifyContent:'space-around'}}>
<Grid item xs={6} md={6} container >
<Box component="form" sx={{ minWidth: 100+'%' }} noValidate autoComplete="off" paddingTop={1}>

  <Button variant="contained" sx={{width:'80%',padding:2,fontSize:16, backgroundColor:'#7e57c2'}}
     onClick={()=>handleButtonClick()} 
  >In Dental ExChange</Button>
  
</Box>  
</Grid>
<Grid item xs={6} md={6} container >
<Box component="form" sx={{  minWidth: 100+'%' }} noValidate autoComplete="off" paddingTop={1}>

  <Button variant="contained" sx={{width:'100%',padding:2,fontSize:16, backgroundColor:'#e040fb'}}
   onClick={()=>handleNonDentalClick()} 
  >Non In Dental Exchange</Button>

</Box>  
</Grid>
</Grid>
<Grid item xs={12} md={12} container justifyContent="center">
<Box component="form" sx={{ width: '100%' }} noValidate autoComplete="off">
 
{/* <TextField
    id="outlined-select-currency"
    label="PatientId"
    select
    fullWidth
    sx={{ height: '100%' }}
    value={selectPatientID}
    onChange={handleSelectPatientID}
  >
    {uniquePatientId.map((patientId) => (
      <MenuItem key={patientId} value={patientId}>
        {patientId}
      </MenuItem>
    ))} 
  </TextField> */}

<Button variant="contained" sx={{width:'100%',padding:2,fontSize:16, backgroundColor:'#29b6f6'}}
     onClick={()=>handleButtonReset()} 
  >RESET</Button>
</Box>

</Grid>

</Grid>
</Grid>
</Box>

<Box sx={{padding:3}} >
<Grid container spacing={2}>
<Grid item sx={12} md={3} container>
<Card  sx={{ minWidth: "100%",height: '100%'  }}>
          <CardContent className={styles.content}>
            
            <OverAllCountByYear ContentValues={ContentValues}  exportToExcel={exportToExcel}/>
          </CardContent>
        </Card>
    </Grid>

    <Grid item sx={12} md={4} container>
    <Card  /* onClick={handleZoomLevel} */ sx={{  minWidth: 100+'%', height: '100%' }}>
          <CardContent className={styles.content} >
           <OverAllCountByMonth 
           PayerFlagDetails={PayerFlagDetails}
            FilteredDetail={FilteredDetail}
            selectedFromDate={selectedFromDate}
            selectedToDate={selectedToDate}
            selectPatientID={selectPatientID}
            selectProvider={selectProvider}
            /> 
          </CardContent>
        </Card> 

    </Grid>

    <Grid item sx={12} md={5} container>
    <Card  sx={{ minWidth: "100%",height: '100%' }}>
          <CardContent className={styles.content}>
           <OverAllCountByDay 
            PayerFlagDetails={PayerFlagDetails}
            FilteredDetail={FilteredDetail}
           />
          </CardContent>
        </Card> 


    </Grid>
    </Grid>
    </Box>

    <Box sx={{padding:3}} >
<Grid container spacing={2}>
<Grid item sx={12} md={3} container>
<Card  sx={{minWidth: 100+'%', height: '100%'}}>
          <CardContent className={styles.content}>
            <DonutChart ContentValues={ContentValues}/>
                     </CardContent>
        </Card>
    </Grid>

    <Grid item sx={12} md={9} container>
    <Card /* onClick={handleZoomLevel} */ sx={{  minWidth: 100+'%', height: '100%' }}>
          <CardContent className={styles.content} >
           <PayerWise
            PayerFlagDetails={PayerFlagDetails}
            FilteredDetail={FilteredDetail}
           /> 
          </CardContent>
        </Card> 

    </Grid>

 
    </Grid>
    </Box>

    </div>
    

  )
}

export default PatientData