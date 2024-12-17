import React, { useState, useRef } from 'react';
import { Chart } from 'react-google-charts';

import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';

const OverAllCountByDay = (FilteredDetail,PayerFlagDetails,selectedMonth) => {

  const VerifiedDetail = FilteredDetail?.PayerFlagDetails?.length > 0 ? (FilteredDetail.PayerFlagDetails ? FilteredDetail.PayerFlagDetails?.filter((data) => data?.isverifiedStatus === 'Verified').map((item) => ({
    isverifiedStatus: item?.isverifiedStatus,
    createdAt: item?.createdAt,
  })) : 0 ) 
: (Array.isArray(FilteredDetail?.FilteredDetail) && FilteredDetail?.FilteredDetail?.length > 0 ? FilteredDetail?.FilteredDetail?.filter((data) => data?.isverifiedStatus === 'Verified')
.map((item) => ({
    isverifiedStatus: item?.isverifiedStatus,
    createdAt: item?.createdAt,
  })) : 0)

  const NotVerifiedDetail = FilteredDetail?.PayerFlagDetails?.length > 0 ? (FilteredDetail.PayerFlagDetails ? FilteredDetail.PayerFlagDetails?.filter((data) => data?.isverifiedStatus === "NotVerified").map((item) => ({
    isverifiedStatus: item?.isverifiedStatus,
    createdAt: item?.createdAt,
  })) : 0 ) 
: (Array.isArray(FilteredDetail?.FilteredDetail) && FilteredDetail?.FilteredDetail?.length > 0 ? FilteredDetail?.FilteredDetail?.filter((data) => data?.isverifiedStatus === "NotVerified")
.map((item) => ({
    isverifiedStatus: item?.isverifiedStatus,
    createdAt: item?.createdAt,
  })) : 0)

  const getCurrentMonthRangeCounts = (VerifiedDetail) => {
    const currentDate = new Date();
    const currentMonth = currentDate?.getMonth(); // 0-based (Jan is 0, Dec is 11)
    const currentYear = currentDate?.getFullYear();
   
    // Initialize the ranges
    const dateRanges = {
      '1-10': 0,
      '11-20': 0,
      '21-31': 0
    };
  
    // Filter VerifiedDetail by current month and year
    const filteredData = Array.isArray(VerifiedDetail) ? VerifiedDetail.filter((item) => {
      const createdAtDate = new Date(item?.createdAt);
      const createdMonth = createdAtDate.getMonth();
      const createdYear = createdAtDate.getFullYear();
      
      // Check if the createdAt is within the current month and year
      return createdMonth === currentMonth && createdYear === currentYear;
    }):0;
  
    // Group by date ranges
    Array.isArray(filteredData) ? filteredData.forEach((item) => {
      const createdAtDate = new Date(item?.createdAt);
      const dayOfMonth = createdAtDate.getDate(); // Get the day of the month
      
      if (dayOfMonth >= 1 && dayOfMonth <= 10) {
        dateRanges['1-10']++;
      } else if (dayOfMonth >= 11 && dayOfMonth <= 20) {
        dateRanges['11-20']++;
      } else if (dayOfMonth >= 21 && dayOfMonth <= 31) {
        dateRanges['21-31']++;
      }
    }):[];
  
    return dateRanges;
  };

  const currentMonthCounts = getCurrentMonthRangeCounts(VerifiedDetail);

  const getCurrentMonthNotVerifiedCounts = (NotVerifiedDetail) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-based (Jan is 0, Dec is 11)
    const currentYear = currentDate.getFullYear();
    
    // Initialize the ranges
    const dateRanges = {
      '1-10': 0,
      '11-20': 0,
      '21-31': 0
    };
  
    // Filter VerifiedDetail by current month and year
    const filteredData = Array.isArray(NotVerifiedDetail) ? NotVerifiedDetail.filter((item) => {
      const createdAtDate = new Date(item?.createdAt);
      const createdMonth = createdAtDate.getMonth();
      const createdYear = createdAtDate.getFullYear();
      
      // Check if the createdAt is within the current month and year
      return createdMonth === currentMonth && createdYear === currentYear;
    }):[];
  
    // Group by date ranges
    Array.isArray(filteredData)  ? filteredData.forEach((item) => {
      const createdAtDate = new Date(item?.createdAt);
      const dayOfMonth = createdAtDate.getDate(); // Get the day of the month
      
      if (dayOfMonth >= 1 && dayOfMonth <= 10) {
        dateRanges['1-10']++;
      } else if (dayOfMonth >= 11 && dayOfMonth <= 20) {
        dateRanges['11-20']++;
      } else if (dayOfMonth >= 21 && dayOfMonth <= 31) {
        dateRanges['21-31']++;
      }
    }):[];
  
    return dateRanges;
  };

  const currentMonthNotVerifiedCounts = getCurrentMonthNotVerifiedCounts(NotVerifiedDetail);


  const combineDateRangeCounts = (currentMonthCounts, currentMonthNotVerifiedCounts) => {
    const combinedCounts = {
      '1-10': 0,
      '11-20': 0,
      '21-31': 0,
    };
  
    // Iterate over the date ranges and sum the counts from both Verified and NotVerified
    Object.keys(combinedCounts).forEach((range) => {
      // Sum the counts for each date range
      combinedCounts[range] = (currentMonthCounts[range] || 0) + (currentMonthNotVerifiedCounts[range] || 0);
    });
  
    return combinedCounts;
  };
  

  const combinedCounts = combineDateRangeCounts(currentMonthCounts, currentMonthNotVerifiedCounts);

 // Function to format the data into the chart format
const formatDataForChart = (combinedCounts, currentMonthCounts, currentMonthNotVerifiedCounts) => {
  // Initialize an array to store the chart data
  const chartData = [
    ['Day Range', 'Total', { role: 'annotation' }, 'Passed', { role: 'annotation' }, 'Failed', { role: 'annotation' }]
  ];

  // Iterate over the combinedData object to generate rows for the chart
  Object.keys(combinedCounts).forEach((dayRange) => {
    const total = combinedCounts[dayRange];
    const passed = currentMonthCounts[dayRange] || 0;
    const failed = currentMonthNotVerifiedCounts[dayRange] || 0;

    // Add a row for each day range
    chartData.push([
      dayRange,           // Day range (e.g., '1-10', '11-20', '21-31')
      total,              // Total count
      `${total}`,        // Annotation for total
      passed,             // Passed count
      `${passed}`,       // Annotation for passed
      failed,             // Failed count
      `${failed}`        // Annotation for failed
    ]);
  });

  return chartData;
};

// Get the formatted data for the chart
const chartFormattedData = formatDataForChart(combinedCounts, currentMonthCounts, currentMonthNotVerifiedCounts);



    const DayRangedata = chartFormattedData
      
      const options = {
        title: 'Overall Count by Day Range (Total, Passed, Failed)',
        chartArea: {
          width: '70%',
          height: '70%',
        },
        hAxis: {
          title: 'Day Range',
          minValue: 0,
          textStyle: {
            fontSize: 10,
            bold: true,
            color: 'black',
          },
        },
        vAxis: {
          title: 'Count',
          textStyle: {
            fontSize: 10,
            bold: true,
            color: 'black',
          },
        },
        colors: ['#7e57c2', '#e040fb', '#d7ccc8'],// ['#4a148c', '#4caf50', '#d50000'], // Colors for Total, Passed, Failed
        bar: {
          groupWidth: '70%', // Adjust width of the bars
        },
        isStacked: false, // Do not stack the bars
        annotations: {
          style: 'text', // Use text for annotations instead of lines
          textStyle: {
            fontSize: 8, // Font size for annotation values
            bold: true,
            color: 'black', // Color of annotation text
          },
        },
      };

      const chartRef = useRef();

  // Function to export data and image to Excel
  const exportToExcel = () => {
    // Capture the chart as an image using html2canvas
    html2canvas(chartRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png'); // Convert the canvas to base64 image

      // Create an ExcelJS workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data');
      const filteredData = DayRangedata.map(row => row.filter((_, index) => index % 2 === 0));

      // Add data to Excel worksheet
      worksheet.addTable({
        name: 'DataTable',
        ref: 'A1',
        columns: [
          { name: 'Day Range', filterButton: true },
          { name: 'Total', filterButton: true },
          { name: 'Passed', filterButton: true },
          { name: 'Failed', filterButton: true },
        ],
        rows: filteredData.slice(1),
      });

      const worksheetImage = workbook.addWorksheet('Image');

      // Add image to Excel (using base64 image)
      const imageId = workbook.addImage({
        base64: imgData,
        extension: 'png',
      });

     
    worksheetImage.addImage(imageId, 'A1:G15'); // Add image at position A1// Position image in Excel

      // Write the workbook to a buffer and download as an Excel file
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'chart_data_with_image.xlsx';
        link.click();
      });
    });
  };

 // Function to export data as CSV
 const exportToCSV = () => {
  const filteredData = DayRangedata.map(row => row.filter((_, index) => index % 2 === 0));

  const headers = ['Day Range', 'Total',  'Passed',  'Failed', ];
  const rows = filteredData.slice(1); // Skipping the header row

  // Convert the data to CSV format
  const csvContent = [
    headers.join(','), // Add the header row
    ...rows.map((row) => row.join(','))// Map the rows to CSV format
  ].join('\n'); // Join all rows with newline

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a link to download the CSV file
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'data.csv'; // CSV file name
  link.click();
};
// Toggle menu state
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [selectedOption,setSelectedOption] = useState('');
const toggleMenu = () => setIsMenuOpen((prev) => !prev);

const handleExport = (e) =>{
const value = e.target.value;
setSelectedOption(value);

if(value === 'excel'){
exportToExcel();
}
else if(value === 'csv'){
exportToCSV();
}
}
  return (
    <div>
 <div  >
<div
        style={{
          paddingLeft: '95%',
          cursor: 'pointer',
          fontSize: '18px',
        }}
        onClick={toggleMenu}
      >
        &#x22EE; {/* Unicode for 3 dots */}
      </div>

       {/* Select dropdown for Export options */}
       {isMenuOpen && (<select 
        value={selectedOption} 
        onChange={handleExport} 
        style={{
          padding: '8px',
          width:'80%',
          fontSize: '14px',
          margin: '5px 10%',
        }}
      >
        <option value="">Select Export Option</option>
        <option value="excel">Export to Excel</option>
        <option value="csv">Export to CSV</option>
      </select>
      ) }

</div>
 
    <div  ref={chartRef} style={{ width: '100%', height: '350px' }}>
<Chart

  chartType="ColumnChart"
  data={DayRangedata}
  options={options}
  width="100%"
  height="100%"
  style={{ paddingTop: 5, fontSize: 10 }}
/>
</div>
    </div>
  )
}

export default OverAllCountByDay