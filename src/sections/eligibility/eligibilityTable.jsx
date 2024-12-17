import { ArrowDropDown } from "@material-ui/icons";
import { Box, Button, Card, CardMedia, Grid, Menu, MenuItem, TextField, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import {
    DataGrid,
    GridToolbarColumnsButton
} from "@mui/x-data-grid";
import { format } from "date-fns";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImportModal from "./importmodule";
import EligibilityModal from "./eligibility-model";
import { InsertDriveFile } from "@material-ui/icons";
import { MoreVert } from "@material-ui/icons";
import { VerifyPatient } from "./Verify";
import VerificationWarningModal from "./verify-warning-model";



const EligibilityTable = ({ data, isLoading }) => {

    const theme = useTheme();

    // (isVerified === true && VerificationError === []) // - YELLOW GREEN
    const handlePatientInformationNavigate = (row) => {
        navigate(`patient-benefit-information/report/${row?.patientId}`);
    }

    const [expandedRows, setExpandedRows] = useState({});

    const toggleReadMore = (rowId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };

    const truncateText = (text, isExpanded, length = 10) => {
        if (isExpanded || text.length <= length) {
            return text;
        }
        return `${text.slice(0, length)}...`;
    };

    const handlePatientBenefitRedirect = (row) => {
        navigate(`patient-benefit-information/${row?.patientId}`)
    }

    const defaultColumns = [
        {
            flex: 0.1,
            field: "patientId",
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                > <strong>Patient Id</strong>
                </div>
            ),
            renderCell: ({ row }) => {
                const { patientId } = row;
                return (
                    <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography
                                noWrap
                                variant="body2"
                                sx={{
                                    color: "primary",
                                    fontWeight: 500,
                                    lineHeight: "22px",
                                    letterSpacing: ".1px",
                                }}
                            >
                                <Typography sx={{ color: theme.palette.secondary.main, cursor: 'pointer', textDecorationLine: 'underline' }}>{`${patientId}`}</Typography>
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            flex: 0.1,
            // minWidth: 150,
            field: "PatientName",
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                > <strong>Patient Name</strong>
                </div>
            ),
            renderCell: ({ row }) => {
                const { PatientName } = row;
                return (
                    <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography
                                noWrap
                                variant="body2"
                                sx={{
                                    color: "primary",
                                    fontWeight: 500,
                                    lineHeight: "22px",
                                    letterSpacing: ".1px",
                                }}
                                onClick={() => handlePatientInformationNavigate(row)}
                            >
                                <Typography sx={{ color: theme.palette.secondary.main, cursor: 'pointer', textDecorationLine: 'underline' }}>
                                    <div
                                        style={{
                                            whiteSpace: 'normal',
                                            wordWrap: 'break-word',
                                            lineHeight: '1.5',
                                        }}
                                    >{`${PatientName}`}
                                    </div>
                                </Typography>
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            flex: 0.1,
            field: "typeOfService",
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                > <strong>Type Of Service</strong>
                </div>
            ),
            renderCell: ({ row }) => (
                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                    {row?.typeOfService ? row?.typeOfService : ""}
                </Box>
            ),
        },
        {
            flex: 0.1,
            // minWidth: 200,
            field: "practiceNameAndLoc",
            // headerName: "Practice Name & Location",
            cellClassName: 'center-align',
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                > <strong>Practice Name & Location</strong>
                </div>
            ),
            renderCell: ({ row }) => (
                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                    <Typography variant="body2">{`${row?.practiceNameAndLoc}`}</Typography>
                </Box>
            ),
        },
        {
            flex: 0.1,
            // minWidth: 150,
            field: "appointmentType",
            // headerName: "Appointment Type",
            cellClassName: 'center-align',
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                > <strong>Appointment Type</strong>
                </div>
            ),
            renderCell: ({ row }) => (
                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                    <Typography variant="body2">{row?.appointmentType ? row?.appointmentType : ""}</Typography>
                </Box>
            ),
        },
        {
            flex: 0.1,
            minWidth: 180,
            field: "payerLogo",
            cellClassName: 'center-align',
            // headerName: "Insurance Name",
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                > <strong>Insurance Name</strong>
                </div>
            ),
            renderCell: ({ row }) => {
                return (
                    <Box>
                        {
                            row?.payerLogo == null ? "-" :
                                <CardMedia
                                    component="img"
                                    height="50"
                                    image={row?.payerLogo}
                                    alt="Base64 Example"
                                />
                        }
                    </Box>
                );
            },
        },
        {
            flex: 0.1,
            // minWidth: 200,
            field: "insurancePayer",
            cellClassName: 'center-align',
            // headerName: "Insurance Name/Plan",
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                > <strong>Insurance Name/Plan</strong>
                </div>
            ),
            renderCell: ({ row }) => (
                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                    {`${row?.insurancePayer}`}
                </Box>
            ),
        },
        {
            flex: 0.1,
            // minWidth: 200,
            field: "remainingBenefits",
            cellClassName: 'center-align',
            // headerName: "Insurance Name/Plan",
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                > <strong>Remaining Benefits/ Deductible</strong>
                </div>
            ),
            renderCell: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                ><p></p>
                </div>
            ),
        },
        {
            flex: 0.1,
            // minWidth: 150,
            field: "scheduleAppointment",
            headerName: "Appointment",
            cellClassName: 'center-align',
            renderCell: ({ row }) => (
                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                    {row?.scheduleAppointment ? format(new Date(row?.scheduleAppointment), 'dd-MM-yyyy HH:mm') : ""}
                </Box>
            ),
        },
        {
            flex: 0.1,
            // minWidth: 150,
            field: "lastVerified",
            // headerName: "Last Verified",
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                > <strong>Last Verified</strong>
                </div>
            ),
            cellClassName: 'center-align',
            renderCell: ({ row }) => (
                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                    {row?.lastVerified ? format(new Date(row?.lastVerified), 'dd-MM-yyyy HH:mm') : ""}
                </Box>
            ),
        },
        {
            flex: 0.1,
            // minWidth: 100,
            field: "Status",
            headerName: "Status",
            cellClassName: 'center-align',
            renderCell: ({ row }) => (
                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                    <Typography variant="body2">{`${row?.Status}`}</Typography>
                </Box>
            ),
        },
        {
            flex: 0.1,
            // minWidth: 100,
            field: "Remarks",
            headerName: "Remarks",
            cellClassName: 'center-align',
            renderCell: ({ row }) => {
                const isExpanded = expandedRows[row.id] || false;
                return (
                    <Box sx={{ height: row.Remarks == "Verified" ? '100%' : 'auto' }}>
                        <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                            <Typography variant="body2">
                                {truncateText(row.Remarks, isExpanded)}
                            </Typography>
                        </Box>
                        {row.Remarks.length > 10 && (
                            <Button
                                size="small"
                                onClick={() => toggleReadMore(row.id)}
                                sx={{}}
                            >
                                {isExpanded ? "Read Less" : "Read More"}
                            </Button>
                        )}
                    </Box>
                );
            },
        },
        {
            flex: 0.1,
            // minWidth: 100,
            field: "effectiveEndDate",
            // headerName: "Policy Expiry Date",
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                > <strong>Policy Expiry Date</strong>
                </div>
            ),
            cellClassName: 'center-align',
            renderCell: ({ row }) => (
                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                    <Typography variant="body2">
                        {row?.effectiveEndDate ? format(new Date(row?.effectiveEndDate), 'dd-MM-yyyy') : "-"}
                    </Typography>
                </Box>
            ),
        },
        {
            flex: 0.1,
            minWidth: 100,
            field: "BenefitsDetails",
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                    }}
                > <strong>Benefits Details</strong>
                </div>
            ),
            cellClassName: 'center-align',
            // headerName: "Benefits Details",
            renderCell: ({ row }) => (
                <>
                {row?.Remarks    == "Verified" && <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                    <Typography sx={{ cursor: 'pointer'}} variant="body2" onClick={() => handlePatientBenefitRedirect(row)}>
                        <InsertDriveFile className=" text-green-600" sx={{fontSize: 20}} />
                    </Typography>
                    <Typography sx={{ cursor: 'pointer'}} variant="body2" onClick={() => handlePatientInformationNavigate(row)}>
                        <InsertDriveFile color='inherit' className=" text-yellow-600" sx={{fontSize: 20}} />
                    </Typography>
                </Box>}
                </>
            ),
        }
    ];

    const [value, setValue] = useState("");
    const [selectedRows, setSelectedRowsData] = useState([]);

    //   const auth = useAuth();
    //   const userId = auth?.state?.user?.userData?.userId;

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [verifyPatientModal, setVerifyPatientModal] = useState({data: null});


    const navigate = useNavigate();

    const handleFilter = (val) => {
        setValue(val);
    };

    const rowsWithIds = data?.map((row, i) => ({
        ...row,
        id: i + 1,
    })) ?? [];

    const columns = [
        ...defaultColumns,
          {
              flex: 0.1,
              minWidth: 100,
              field: "Action",
              headerName: "Action",
              cellClassName: 'center-align',
              renderCell: ({ row }) => {
                const [anchorEl, setAnchorEl] = useState(null);
          
                const handleClick = (event) => {
                  setAnchorEl(event.currentTarget);
                };
          
                const handleClose = () => {
                  setAnchorEl(null);
                };
          
                const handleDownload = () => {
                  console.log("Downloading PDF for uniqueId:", row.uniqueId);
                  // Add your download logic here
                  handleClose();
                };
          
                const handleVerify = () => {
                  console.log("Verifying patient:", row);
                  // Add your verification logic here
                  handleClose();
                };
          
                return (
                  <Box display="flex" justifyContent="center" width={100}>
                    <Button
                      id={`action-button-${row.uniqueId}`}
                      variant="text"
                      aria-controls={anchorEl ? `menu-${row.uniqueId}` : undefined}
                      aria-haspopup="true"
                      aria-expanded={anchorEl ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <MoreVert />
                    </Button>
                    <Menu
                      id={`menu-${row.uniqueId}`}
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": `action-button-${row.uniqueId}`,
                      }}
                    >
                      <MenuItem onClick={handleDownload}>Download PDF</MenuItem>
                      <VerifyPatient
                                    lastName={row?.lastName}
                                    lastVerified={row?.lastVerified}
                                    firstName={row?.firstName}
                                    isVerified={row?.isVerified}
                                    uniqueId={row?.uniqueId}
                                    isScheduled={String(row?.isScheduled)}
                                    handleClose={handleClose}
                                    setVerifyPatientModal={setVerifyPatientModal}
                                />
                      <MenuItem onClick={handleClose}>Exclude</MenuItem>
                      <MenuItem onClick={handleClose}>Edit</MenuItem>
                      <MenuItem onClick={handleClose}>Delete</MenuItem>
                      <MenuItem onClick={handleClose}>View Insurance Card</MenuItem>
                    </Menu>
                  </Box>
                );
              },
          }
    ];

    const filteredRows = rowsWithIds.filter((row) =>
        Object.values(row).some((fieldValue) =>
            fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase())
        )
    );

    const handleRowSelection = (selectionModel) => {
        const selectedRows = rowsWithIds.filter((row) => selectionModel.includes(row.id));
        setSelectedRowsData(selectedRows);
    };


    const CustomToolbar = () => {
        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };
        return (

            <Box display='flex' justifyContent='end' gap={3} p={2} width='100%'>
                <GridToolbarColumnsButton
                    slotProps={{
                        button: {
                            color: 'secondary',
                            variant: 'outlined'
                        },
                        tooltip: {
                            title: 'Show/Hide Columns', // Customize the tooltip text
                        },
                    }}
                />
                {
                    selectedRows.length < 2 ? (
                        <Button
                            color="primary"
                            variant='outlined'
                            disabled
                            style={{ textWrap: "nowrap" }}
                        >
                            Bulk Action
                        </Button>) : (
                        <div>
                            <Button
                                id="basic-button"
                                variant='contained'
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                endIcon={<ArrowDropDown />}
                            >
                                Bulk Action
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
                                <MenuItem onClick={handleClose}>CSV</MenuItem>
                                <MenuItem onClick={handleClose}>PDF</MenuItem>
                                <MenuItem onClick={handleClose}>Verify Now</MenuItem>
                                <MenuItem onClick={handleClose}>Exclude</MenuItem>
                            </Menu>
                        </div>
                    )}

                <ImportModal 
                // onSuccess={onSuccess}
                 />

                <EligibilityModal 
                // onSuccess={onSuccess} 
                />
            </Box>
        )
    }
console.log(verifyPatientModal)

    return (
        <Box>
            {verifyPatientModal?.data && (
          <VerificationWarningModal
            {...verifyPatientModal?.data}
            closeModal={() => {
              setVerifyPatientModal({ data: null });
            }}
            open={verifyPatientModal?.data ? true : false}
          />
        )}
            <Grid container spacing={6} sx={{}}>
                <Grid item xs={12}>
                    <Card>
                        <Box display='flex' width='100%' pl={2} pt={5}>
                            <TextField
                                size="small"
                                value={value}
                                sx={{ mr: 6, mb: 2, width: 400 }}
                                placeholder="Search"
                                onChange={(e) => handleFilter(e.target.value)}
                            />

                        </Box>
                        <Box sx={{ height: filteredRows?.length == 0 ? 340 : "100%" }}>
                            <DataGrid
                                columnHeaderHeight={70}
                                autoHeight
                                // rowHeight={90}
                                getRowHeight={() => 'auto'}
                                checkboxSelection
                                rows={filteredRows}
                                columns={columns}
                                disableRowSelectionOnClick
                                pagination
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                onRowSelectionModelChange={handleRowSelection}
                                rowCount={filteredRows?.length}
                                pageSizeOptions={[10, 25, 50, 100]}
                                loading={isLoading}
                                sx={{
                                    backgroundColor: "white",
                                    "& .MuiDataGrid-columnHeaderTitle": {
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                    },
                                    "& .MuiDataGrid-columnHeader": {
                                        fontSize: "14px",
                                        backgroundColor: "#ededed",
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
                                slots={{
                                    toolbar: CustomToolbar,
                                }}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EligibilityTable;



