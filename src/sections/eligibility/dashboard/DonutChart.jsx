import React, { useState, useRef } from 'react';
import { Chart } from 'react-google-charts';

import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';
import styles from './styles.module.css';

const DonutChart = (ContentValues) => {

  const passed = ContentValues?.ContentValues[4]?.value;
const failed = ContentValues?.ContentValues[5]?.value;

  const data = [
    ['Status', 'Count'],
    ['Passed', passed],  // Replace with actual passed data
    ['Failed', failed],  // Replace with actual failed data
  ];

  const options = {
    title: 'Overall Passed vs Failed',
    pieHole: 0.6,  // This makes the chart a donut
    is3D: false,   // Optional: if you want a 3D look
    colors: ['#e040fb', '#d7ccc8'], 
    textStyle: {
      fontSize: 10,
      color: '#222',
      bold: true,
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

      // Add data to Excel worksheet
      worksheet.addTable({
        name: 'DataTable',
        ref: 'A1',
        columns: [
          { name: 'Status', filterButton: true },
          { name: 'Count', filterButton: true },
        ],
        rows: data.slice(1),
      });

      const worksheetImage = workbook.addWorksheet('Image');
      // Add image to Excel (using base64 image)
      const imageId = workbook.addImage({
        base64: imgData,
        extension: 'png',
      });

      worksheetImage.addImage(imageId, 'A1:G15');// Position image in Excel

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
    const headers = ['Status', 'Count'];
    const rows = data.slice(1); // Skipping the header row
  
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
    <div >
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

    <div  ref={chartRef} style={{ display: 'flex',justifyContent: 'center', alignItems: 'center',paddingBottom:10 }} className={styles.chartContainer}>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width="122%"
        height="450px" // Height can be adjusted for responsiveness
        sx={{ color:'#222'}}
      />
    </div>
    </div>
  );
};

export default DonutChart;
