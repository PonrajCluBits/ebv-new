import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Box, Tabs, Tab, CircularProgress } from "@mui/material";

const AllTable = () => {
  return (
    <>
    All Table
    </>
  )
}
const ActiveCoverageTable = () => {
  return (
    <>
    ActiveCoverageTable
    </>
  )
}
const CoInsuranceTable = () => {
  return (
    <>
    CoInsuranceTable
    </>
  )
}
const DeductibleTable = () => {
  return (
    <>
    DeductibleTable
    </>
  )
}
const LimitationAndMaximumTable = () => {
  return (
    <>
    LimitationAndMaximumTable
    </>
  )
}
const NotCoveredTable = () => {
  return (
    <>
    NotCoveredTable
    </>
  )
}
const AdaProcedureTable = () => {
  return (
    <>
    AdaProcedureTable
    </>
  )
}
const PatientAndPayerInformation = () => {
  return (
    <>
    PatientAndPayerInformation
    </>
  )
}
const BenefitHistoryTable = () => {
  return (
    <>
    BenefitHistoryTable
    </>
  )
}
const EmployerInformation = () => {
  return (
    <>
    EmployerInformation
    </>
  )
}
const Miscellaneous = () => {
  return (
    <>
    Miscellaneous
    </>
  )
}

const PatientBenefitInformationTabs = React.memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useLocation();

  const tabId = searchParams.get("tabId");
  const [activeTab, setActiveTab] = useState(tabId || "1");

  useEffect(() => {
    if (tabId) setActiveTab(tabId);
  }, [tabId]);

  const toggle = (tab) => {
    setSearchParams(
      {
        ...Array.from(searchParams.entries()).reduce((acc, [key, value]) => {
          return { ...acc, [key]: value };
        }, {}),
        tabId: tab,
      },
      { state }
    );
    if (activeTab !== tab) setActiveTab(tab);
  };

  const renderLoader = (label) => (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="200px">
      <CircularProgress />
      <Box ml={2}>{label}</Box>
    </Box>
  );

  const tabContent = {
    1: <React.Suspense fallback={renderLoader("Loading All...")}><AllTable /></React.Suspense>,
    2: <React.Suspense fallback={renderLoader("Loading Active Coverage...")}><ActiveCoverageTable /></React.Suspense>,
    3: <React.Suspense fallback={renderLoader("Loading Co Insurance...")}><CoInsuranceTable /></React.Suspense>,
    5: <React.Suspense fallback={renderLoader("Loading Deductible...")}><DeductibleTable /></React.Suspense>,
    6: <React.Suspense fallback={renderLoader("Loading Limitation & Maximum...")}><LimitationAndMaximumTable /></React.Suspense>,
    7: <React.Suspense fallback={renderLoader("Loading Not Covered...")}><NotCoveredTable /></React.Suspense>,
    4: <React.Suspense fallback={renderLoader("Loading ADA Procedure...")}><AdaProcedureTable /></React.Suspense>,
    8: <React.Suspense fallback={renderLoader("Loading Patient & Payer Info...")}><PatientAndPayerInformation /></React.Suspense>,
    9: <React.Suspense fallback={renderLoader("Loading Benefits History...")}><BenefitHistoryTable /></React.Suspense>,
    10: <React.Suspense fallback={renderLoader("Loading Employer Info...")}><EmployerInformation /></React.Suspense>,
    11: <React.Suspense fallback={renderLoader("Loading Miscellaneous...")}>
          <Miscellaneous />
          {/* <NotesAndRemarks />
          <AttachmentTable /> */}
        </React.Suspense>,
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(e, tab) => toggle(tab)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="All" value="1" />
        <Tab label="Active Coverage" value="2" />
        <Tab label="Co Insurance" value="3" />
        <Tab label="Deductible" value="5" />
        <Tab label="Limitation & Maximum" value="6" />
        <Tab label="Not Covered" value="7" />
        <Tab label="ADA Procedure" value="4" />
        <Tab label="Patient & Payer Information" value="8" />
        <Tab label="Benefits History" value="9" />
        <Tab label="Employer Information" value="10" />
        <Tab label="Miscellaneous" value="11" />
      </Tabs>

      <Box mt={3}>{tabContent[activeTab]}</Box>
    </Box>
  );
});

export default PatientBenefitInformationTabs;
