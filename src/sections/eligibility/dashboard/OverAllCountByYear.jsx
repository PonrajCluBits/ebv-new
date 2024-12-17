import React, { useState, useRef } from 'react';
import { Chart } from 'react-google-charts';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import { useQuery } from "react-query";
import { fetchUsers } from "./FetchContext"; 


const OverAllCountByYear = (ContentValues) => {

/*   const {ContentValues} =props; */

// Extract values for Passed (index 4) and Failed (index 5)
const passed = ContentValues?.ContentValues[4]?.value;
const failed = ContentValues?.ContentValues[5]?.value;

// Calculate the Overall value as the sum of Passed and Failed
const overall = passed + failed;

// Get the current year dynamically
const currentYear = new Date().getFullYear();

// Create the annotatedData for the chart
const annotatedData = [
  ['Year', 'Overall', { role: 'annotation' }, 'Passed', { role: 'annotation' }, 'Failed', { role: 'annotation' }],
  [`${currentYear}`, overall, `${overall}`, passed, `${passed}`, failed, `${failed}`],  // Use string values for annotations
];


  // Chart options
  const options = {
    title: 'Overall Count by Year (2024)',
    chartArea: {
      width: '50%',
      height: '70%',
    },
    
    hAxis: {
      title: 'Year',
      minValue: 0,
      textStyle: {
        fontSize: 10, // Axis label font size
        bold: true,
        color: 'black',
      },
    },
    vAxis: {
      title: 'Count',
      textStyle: {
        fontSize: 10, // Axis label font size
        bold: true,
        color: 'black',
      },
    },
    
    colors: ['#7e57c2', '#e040fb', '#d7ccc8'], // Colors for the bars (overall, passed, failed)
    annotations: {
      style: 'text', // Ensures annotations are visible even if bars are too short
      textStyle: {
        fontSize: 8, // Font size for the count values
        bold: true,
        color: 'black', // Count values in white
      },
    },
    bar: {
      groupWidth: '70%', // Adjusts the width of the bars
    },
  /*   series: {
      0: {
        color: '#7e57c2',
        // Simulating a shadow effect by using lighter color and increased opacity
        // Simulate shadow with slight offset in color and a darker shade
        shadow: { 
          offsetX: 2,
          offsetY: 2,
          blurRadius: 3,
          color: 'rgba(0,0,0,0.3)', // Shadow color
        },
      },
      1: {
        color: '#e040fb',
        shadow: { 
          offsetX: 2,
          offsetY: 2,
          blurRadius: 3,
          color: 'rgba(0,0,0,0.3)', // Shadow color
        },
      },
      2: {
        color: '#d7ccc8',
        shadow: { 
          offsetX: 2,
          offsetY: 2,
          blurRadius: 3,
          color: 'rgba(0,0,0,0.3)', // Shadow color
        },
      },
    }, */
    isStacked: false,
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
      const filteredData = annotatedData.map(row => row.filter((_, index) => index % 2 === 0));

      // Add data to Excel worksheet
      worksheet.addTable({
        name: 'DataTable',
        ref: 'A1',
        columns: [
          { name: 'Year', filterButton: true },
          { name: 'Overall', filterButton: true },
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


    worksheetImage.addImage(imageId, 'A1:G15'); // Add image at position A1
/*       worksheet.addImage(imageId, 'A1'); // Position image in Excel */

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
    const filteredData = annotatedData.map(row => row.filter((_, index) => index % 2 === 0));

    const headers = ['Year', 'Overall',  'Passed', 'Failed'];
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
          margin: '5px 30px',
        }}
      >
        <option value="">Select Export Option</option>
        <option value="excel">Export to Excel</option>
        <option value="csv">Export to CSV</option>
      </select>
      ) }

</div>

      {/* Google Chart */}
      <div ref={chartRef} style={{ position: 'relative', width: '100%', height:'350px' }}>
        <Chart
          chartType="ColumnChart"
          data={annotatedData}
          options={options}
          width="100%"
          height="100%"
          style={{ fontSize: 12, fontWeight: 500 }}
        />
      </div>
    </div>
  );
};

export default OverAllCountByYear;
