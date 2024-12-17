import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { usePatientListQuery } from 'src/framework/rest/eligibility/eligibility.query';
import EligibilityTable from 'src/sections/eligibility/eligibilityTable';
// import { useEligibilityCountQuery } from '../../../apis/eligibility';
// import EligibilityFilterTable from './eligibilityFilterTable';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
    //   role="tabpanel"
      hidden={value !== index}
    //   id={`simple-tabpanel-${index}`}
    //   aria-labelledby={`simple-tab-${index}`}    
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Eligibility() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

//   const data  = []
  const {data, isLoading} = usePatientListQuery({Status: ""})

  const filteredActivePatient = data?.data.filter(
    (patient) => patient.Status === "Active"
  );

  const filteredInActivePatient = data?.data.filter(
    (patient) => patient.Status !== "Active"
  );

  return (
    <Box sx={{ width: '100%', height: '100%', backgroundColor: "#fff" }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="secondary tabs example">
          {/* <Tab label={`All (${data?.Count[0]?.TotalCount})`}  /> */}
          <Tab label={`All (${data?.data?.length || 0})`}  />
          <Tab label={`Verified (${filteredActivePatient?.length || 0})`}  />
          <Tab label={`Not Verified (${filteredInActivePatient?.length || 0})`} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0} >
            <EligibilityTable data = {data?.data} isLoading ={isLoading}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {/* <EligibilityFilterTable filterValue = {"active"}/> */}
            <EligibilityTable data = {filteredActivePatient} isLoading ={isLoading} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {/* <EligibilityFilterTable filterValue = {"inactive"}/> */}
            <EligibilityTable data = {filteredInActivePatient} isLoading ={isLoading} />
      </CustomTabPanel>
    </Box>
  );
}