import React, { useState } from "react";
import {
    TextField,
    Typography,
    Box,
    Grid,
} from "@mui/material";
import { fDate } from "src/utils/format-time";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from "@mui/material/styles";
// import CallHistory from "./callHistory";
import { API_ENDPOINTS } from "src/utils/endpoints";
import { useReportMutation } from "src/framework/rest/eligibility/eligibility.query";
import toast from "react-hot-toast";
import { useForm } from 'react-hook-form';
// import { useLogoQuery } from "src/framework/rest/account/account.query";
// import { getUserId } from "src/utils/get-userId";

// const Twilio = ({ call }) => (
//     <Call phone={call} />
// );

// const Pulse = () => (
//     <iframe
//         title="pulse"
//         allow="camera *; geolocation *; microphone *; autoplay *; display-capture *"
//         height={600}
//         width={400}
//         src="https://calldesk.pulsework360.com/Dialer/3996c82aa955ab45fcc76f39d217f371/clicktocallpage.php?userID=2711001&secret=User@1001&authID=3996c82aa955ab45fcc76f39d217f371"
//     ></iframe>
// );

const BenefitReport = ({Result, loader}) => {
    const { param } = useParams();
    const { mutate: EligibilityDetails } = useReportMutation();
    const theme = useTheme();
    const [value, setValue] = useState("");
    // const [selectedComponent, setSelectedComponent] = useState('Twilio');
    const [tableDetails, setTableDetails] = useState();
    const [open, setOpen] = useState(false);


    const {
        reset,
      } = useForm();

    const [editedRow, setEditedRow] = useState(null);
    const [editedValue, setEditedValue] = useState('');

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const handleOpen = () => {
        setOpen(true);
    };

    // const handleClose = () => {
    //     setOpen(false);
    //     setSelectedComponent('Twilio');
    // };

    // const handleChange = (event) => {
    //     setSelectedComponent(event.target.value); // Update state on selection change
    //     if (event.target.value == "Pulse") {
    //         handleOpen()
    //     }
    // };


    const handleChangeEdit = (value) => {
        setEditedValue(value);
    };

    const handleSave = async (row) => {
        let result = editedValue;
        let code = row?.CODE;
        let patientId = row?.PatientID
        EligibilityDetails(
            {
                "PatientId": patientId,
                "ADACode": code,
                "CoveragePer": result,
            },
            {
                onSuccess: async (response) => {
   
                    if(response?.status === 200){
                   
                    setTableDetails(response?.data?.Result?.TableDetails)

                    toast.success("Coverage Downgraded has been updated");
                    setEditedRow(null);
                    reset();
                    }
                     queryClient.refetchQueries(API_ENDPOINTS.PATIENT_REPORT);
                   
                },
                onError: (error) => {
                    console.log(error, "ERROR")
                    toast.error(error?.response?.data?.message, { duration: 3000 });
                },
            }
        );

    };
    const handleEdit = (row) => {
        setEditedRow(row);
        setEditedValue(row.CoveragePer);
    };

    const handleCancel = (row) => {
        setEditedValue(row.CoveragePer);
        setEditedRow(null);
    };

    const columns = [
        {
            flex: 0.1,
            minWidth: 100,
            field: "CODE",
            headerName: "CDT Code",
            renderCell: ({ row }) => (
                <Typography
                    variant="body2"
                    sx={{ mt: 2 }}
                >{row?.CODE ? row?.CODE : "-"}</Typography>
            ),
        },
        {
            flex: 0.1,
            minWidth: 150,
            field: "Groups",
            headerName: "Group",
            renderCell: ({ row }) => (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    {row?.Groups ? row?.Groups : "-"}
                </Typography>
            ),
        },
        {
            flex: 0.1,
            minWidth: 250,
            field: "ProcedureN",
            headerName: "Procedure",
            renderCell: ({ row }) => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.9',
                    }}
                >
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {row?.ProcedureN ? row?.ProcedureN : "-"}
                    </Typography>
                </div>
            ),
        },
        {
            flex: 0.1,
            minWidth: 100,
            field: "Fee",
            headerName: "Fee",
            renderCell: ({ row }) => (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    {row?.Fee ? row?.Fee : "-"}
                </Typography>
            ),
        },
        {
            flex: 0.1,
            minWidth: 100,
            field: "UCR",
            headerName: "UCR",
            renderCell: ({ row }) => (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    {row?.UCR ? row?.UCR : "-"}
                </Typography>
            ),
        },
        {
            flex: 0.1,
            minWidth: 150,
            field: "CoveragePer",
            headerName: "% Coverage Downgraded",
            renderCell: ({ row }) => (
                <Typography variant="body2" sx={{ mt: 1 }}>
                    {editedRow?.id === row.id ? (
                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                            <TextField
                                value={editedValue}
                                onChange={(e) => handleChangeEdit(e.target.value)}
                                name='CoveragePer'
                                autoFocus
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                    },
                                }}
                            />
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className="me-2"
                                    onClick={() => handleSave(row)}
                                    style={{ cursor: "pointer", color: "green", fontSize: "15px" }}
                                />
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    onClick={() => handleCancel(row)}
                                    style={{ cursor: "pointer", color: "red", fontSize: "15px" }}
                                />
                            </Box>
                        </Box>
                    ) : (

                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                            <span>{row?.CoveragePer ? row?.CoveragePer : "-"}</span>
                            <FontAwesomeIcon
                                icon={faPen}
                                className="me-2"
                                onClick={() => handleEdit(row)}
                                style={{ cursor: "pointer" }}
                            />
                        </Box>
                    )}
                </Typography>
            ),
        },
        {
            flex: 0.1,
            minWidth: 150,
            field: "OtherComments",
            headerName: "Other comments & Limitations",
            renderCell: ({ row }) => (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    {row?.OtherComments ? row?.OtherComments
                        : "-"}
                </Typography>
            ),
        },

    ];

    // const { data: Result, isLoading: loader } = usePatientBenefitListdetailsQuery({
    //     "PatientId": param,
    //     "Category": "",
    //     "AdaCode": [""]
    // });


    const rowsdata = (tableDetails?.length > 0
        ? tableDetails
        : Result?.Result?.TableDetails
    )?.map((row, i) => ({
        ...row,
        id: i + 1,
    })) || [];

    const filteredRowss = rowsdata.filter((row) =>
        Object.values(row).some(
            (fieldValue) =>
                fieldValue &&
                fieldValue.toString().toLowerCase().includes(value.toLowerCase())
        )
    );

    // const { data } = useLogoQuery({loginUser: getUserId()})
    // const Result = []

    return (
        <Grid container>
            <Grid item xs={12} sm={12}>
                <Box boxShadow={5} bgcolor={"#fff"} borderRadius={2}>
                    <Grid
                        container
                        alignItems="center"
                        sx={{ padding: { xs: 0, sm: 2 } }}
                    >
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'start' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'start' }}>
                                <img src="/images/login/logo.png" alt="Logo" style={{ width: 140, height: 70 }} />
                                {/* <img src={`${import.meta.env.VITE_ELIGIBILITY_PATIENT_URL}/${data?.data[0]?.logopath}`} style={{ width: 160, height: 50 }} alt="CluBits" /> */}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ color: 'black', fontWeight: "bolder", fontSize: { xs: '18px', sm: '22px' } }}>
                                Detailed Breakdown
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: "bolder",
                                    fontSize: { xs: '16px', sm: '20px' },
                                    backgroundColor: '#824ed3',
                                    color: '#FFFFFF',
                                    padding: '0px 10px',
                                    borderRadius: '4px',
                                    marginTop: { xs: 1, sm: 0 },
                                }}
                            >
                                Beta
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: "0px 0px 0px 0px " }}>
                            <Typography variant="body1" sx={{ color: 'black', fontSize: { xs: '14px', sm: '15px' }, fontWeight: "bold" }}>
                                +91 8668150278
                            </Typography>
                        </Grid>
                        {/* <Grid item xs={12} md={12}>
                    <Box display='flex'gap={2} justifyContent='end'>
                                <FormControl>
                                    <InputLabel >Call Option</InputLabel>
                                    <Select
                                        size='small'
                                        value={selectedComponent}
                                        label="Call Option"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Twilio">Call Via Twilio</MenuItem>
                                        <MenuItem value="Pulse">Call via Pulse</MenuItem>
                                    </Select>
                                </FormControl>

                                {selectedComponent === 'Twilio' && <Twilio call={"+91 8668150278"} />}
                            </Box>
                        </Grid> */}
                    </Grid>
                    <Box sx={{ padding: { xs: 0, sm: 3 } }}>
                        <Grid container sx={{ border: '1px solid #824ed3', borderRadius: '4px', width: "100%", margin: "20px 0px 20px 0px" }}>
                            <Box sx={{ backgroundColor: '#eeeded', width: '100%' }}>
                                <Grid container spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                height: "auto",
                                                color: 'black',
                                                padding: '8px 8px 8px 15px',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'start',
                                                gap: "10px",
                                                alignItems: "center",
                                                width: '100%',
                                                margin: '10px auto',
                                                fontWeight: "bold",
                                                fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Responsive font size
                                            }}
                                        >
                                            <span>Insurance Remaining:</span>
                                            <Typography sx={{ color: "red" }}>
                                                {Result?.Result?.InsuranceDetails?.DeductibleRemaining}
                                            </Typography>
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={6}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                height: "auto",
                                                color: 'black',
                                                padding: '8px 8px 8px 15px',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'start',
                                                gap: "10px",
                                                alignItems: "center",
                                                width: '100%',
                                                margin: '10px auto',
                                                fontWeight: "bold",
                                                fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Responsive font size
                                            }}
                                        >
                                            <span>Deductible Remaining:</span>
                                            <Typography sx={{ color: "red" }}>
                                                {Result?.Result?.InsuranceDetails?.DeductibleRemainingMet}
                                            </Typography>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Box sx={{ padding: { xs: 1, sm: 0 } }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            backgroundColor: '#824ed3',
                                            color: 'white',
                                            padding: '6px 6px 6px 15px',
                                            borderRadius: '4px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        PATIENT INFORMATION
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Grid container spacing={1} sx={{ padding: "10px", textAlign: "start" }}>
                                            <Grid item xs={4} sx={{ backgroundColor: '#eeeded', padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', }}>Patient Name:</Typography>
                                            </Grid>
                                            <Grid item xs={8} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1"  >{Result?.Result?.PatientDetails?.PatientName}</Typography>
                                            </Grid>
                                            <Grid item xs={4} sx={{ padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Date Of Birth:</Typography>
                                            </Grid>
                                            <Grid item xs={8} sx={{ padding: '10px' }}>
                                                <Typography variant="body1">
                                                    {fDate(Result?.Result?.PatientDetails?.DateOfBirth)}

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4} sx={{ backgroundColor: '#eeeded', padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Patient id#:</Typography>
                                            </Grid>
                                            <Grid item xs={8} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1">{Result?.Result?.PatientDetails?.MemberId}</Typography>
                                            </Grid>
                                            <Grid item xs={4} sx={{ padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Phone#:</Typography>
                                            </Grid>
                                            <Grid item xs={8} sx={{ padding: '10px' }}>
                                                <Typography variant="body1">
                                                    {Result?.Result?.PatientDetails?.WirelessPhone}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            backgroundColor: '#824ed3',
                                            color: 'white',
                                            padding: '6px 6px 6px 15px',
                                            borderRadius: '4px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        SUBSCRIBER INFORMATION
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Grid container spacing={1} sx={{ padding: "10px" }}>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', width: "100%" }}> Subscriber Name:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1" >{Result?.Result?.PatientDetails?.SubscriberName}</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Date of Birth:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1">
                                                    {fDate(Result?.Result?.PatientDetails?.SubscriberDateOfBirth)}

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Subscriber ID/SSN#:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1">{Result?.Result?.PatientDetails?.SubscriberId}</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Plan/Group:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1">
                                                    {Result?.Result?.PatientDetails?.GroupNumber}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}  >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Employer Name:	</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }} >
                                                <Typography variant="body1">
                                                    {Result?.Result?.PatientDetails?.GroupName}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            backgroundColor: '#824ed3',
                                            color: 'white',
                                            padding: '6px 6px 6px 15px',
                                            borderRadius: '4px',
                                            textAlign: "center"
                                        }}
                                    >
                                        INSURANCE INFORMATION
                                    </Typography>
                                </Grid  >
                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Grid container spacing={1} sx={{ padding: "10px", textAlign: "start" }}>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', }}>Insurance Name:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1">{Result?.Result?.InsuranceDetails?.InsurancePayer}</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Claim Mailing Add:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1">{Result?.Result?.InsuranceDetails?.ClaimMailingAdd}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Ins Phone: </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1">{Result?.Result?.InsuranceDetails?.insurancePhoneNumber}</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Payer ID:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1">
                                                    {Result?.Result?.InsuranceDetails?.PayerIdCode}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Insurance Eff Date:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1">
                                                    {fDate(Result?.Result?.InsuranceDetails?.EffectiveDateFrom)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Waiting Period:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1">
                                                    {Result?.Result?.InsuranceDetails?.WaitingPeriod}

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Replacement Guide:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1">
                                                    {Result?.Result?.InsuranceDetails?.ReplacementGuide}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }} >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>In . Out Network:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1">
                                                    {Result?.Result?.InsuranceDetails?.Network}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box >
                                        <Grid container spacing={1} sx={{ padding: "10px", textAlign: "start" }}>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Plan Year:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1"> </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Individual Ded:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1">{Result?.Result?.InsuranceDetails?.DeductibleRemaining}</Typography>
                                            </Grid>

                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Family Deductible:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1">{Result?.Result?.InsuranceDetails?.DeductibleRemainingFamily}</Typography>
                                            </Grid>

                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Deductible app to:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1"></Typography>
                                            </Grid>

                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Annual Maximum:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1"></Typography>
                                            </Grid>

                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Lifetime Maximum:</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ padding: '10px' }}>
                                                <Typography variant="body1"></Typography>
                                            </Grid>

                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Any pending claims?</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1"></Typography>
                                            </Grid>

                                            <Grid item xs={10} sx={{ padding: '10px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Possible Remaining Benefits:</Typography>
                                            </Grid>
                                            <Grid item xs={2} sx={{ padding: '10px' }}>
                                                <Typography variant="body1"></Typography>
                                            </Grid>

                                            <Grid item xs={10} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Ins pays Office / Subscriber?:</Typography>
                                            </Grid>
                                            <Grid item xs={2} sx={{ backgroundColor: '#eeeded', padding: '10px' }}>
                                                <Typography variant="body1"></Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                backgroundColor: '#824ed3',
                                                color: 'white',
                                                padding: '6px 6px 6px 15px',
                                                borderRadius: '4px',
                                                textAlign: "center"
                                            }}
                                        >
                                            INSURANCE BENEFITS
                                        </Typography>
                                    </Grid  >
                                    <Box sx={{ width: '100%', marginTop: "10px" }}>
                                        <Box display='flex' width='100%' pl={2} pt={2}>
                                            <TextField
                                                size="small"
                                                value={value}
                                                sx={{ mr: 6, mb: 2, width: 300 }}
                                                placeholder="Search"
                                                onChange={(e) => handleFilter(e.target.value)}
                                            />

                                        </Box>
                                        <DataGrid
                                            autoHeight
                                            rows={filteredRowss}
                                            columns={columns}
                                            pagination
                                            disableRowSelectionOnClick
                                            paginationModel={paginationModel}
                                            onPaginationModelChange={setPaginationModel}
                                            rowCount={filteredRowss?.length}
                                            pageSizeOptions={[10, 25, 50, 100]}
                                            loading={loader}
                                            sx={{
                                                backgroundColor: "white",
                                                "& .MuiDataGrid-columnHeaderTitle": {
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                },
                                                "& .MuiDataGrid-columnHeader": {
                                                    fontSize: "14px",
                                                    backgroundColor: "#eeeded",
                                                    color: "black"
                                                },
                                                "& .css-rcz3mg-MuiDataGrid-root": {
                                                    width: "1000px"
                                                },
                                                "& .css-levciy-MuiTablePagination-displayedRows ": {
                                                    marginTop: 2
                                                },
                                                "& .css-pdct74-MuiTablePagination-selectLabel ": {
                                                    marginTop: 2
                                                },
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    {/* <CustomDialog
                        open={open}
                        onClose={handleClose}
                        // title="Call"
                        content={
                            <Paper elevation={1} sx={{ width: 400 }}>
                                <Box display='flex' justifyContent='space-between'>
                                    <Box display='flex' textAlign='center' alignItems='center' ml={2}>
                                        <Typography variant='h6' color={theme.palette.primary.main}>Call Via Pulse</Typography>
                                    </Box>
                                    <Button color='error' type="button" sx={{ m: 1 }} variant='text' onClick={handleClose}>
                                        close
                                    </Button>
                                </Box>
                                {selectedComponent === 'Pulse' && <Pulse />}
                            </Paper>}
                    /> */}

                </Box>
            </Grid>
            {/* <Grid item xs={12} md={4} pl={2}>
            <Paper elevation={3} sx={{p: 2}}>
                <Typography variant="h6" mb={2}>Call History</Typography>
            <CallHistory mobile={"+91 8668150278"} />
            </Paper>
        </Grid> */}
        </Grid>
    );
};

export default BenefitReport;