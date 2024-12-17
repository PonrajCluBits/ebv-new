import React, { useState, useRef } from 'react';
import { Chart } from 'react-google-charts';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';

function PayerWise(FilteredDetail,PayerFlagDetails) {
  const [zoomed, setZoomed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const VerifiedDetail = FilteredDetail?.PayerFlagDetails.length > 0 ? (
    FilteredDetail?.PayerFlagDetails ?
    FilteredDetail?.PayerFlagDetails?.filter((data) => data?.isverifiedStatus === 'Verified')
    .map((item) => ({
      isverifiedStatus: item?.isverifiedStatus,
      Groupname:item.Groupname,
    })) : []
  ) : (
    Array.isArray(FilteredDetail?.FilteredDetail) && FilteredDetail?.FilteredDetail.length > 0 ?
    FilteredDetail?.FilteredDetail?.filter((data) => data?.isverifiedStatus === 'Verified')
    .map((item) => ({
      isverifiedStatus: item?.isverifiedStatus,
      Groupname:item.Groupname,
    })) : []
  );

  const NotVerifiedDetail = FilteredDetail?.PayerFlagDetails.length > 0 ? (
    FilteredDetail?.PayerFlagDetails ?
    FilteredDetail?.PayerFlagDetails?.filter((data) => data?.isverifiedStatus === 'NotVerified')
    .map((item) => ({
      isverifiedStatus: item?.isverifiedStatus,
      Groupname:item.Groupname,
    })) : []
  ) : (
    Array.isArray(FilteredDetail?.FilteredDetail) && FilteredDetail?.FilteredDetail.length > 0 ?
    FilteredDetail?.FilteredDetail?.filter((data) => data?.isverifiedStatus === 'NotVerified')
    .map((item) => ({
      isverifiedStatus: item?.isverifiedStatus,
      Groupname:item.Groupname,
    })) : []
  );


  
  // Function to count the number of verified entries for each unique Groupname
  const countVerifiedByGroupname = (VerifiedDetail) => {
    return VerifiedDetail.reduce((acc, item) => {
      // If the Groupname is already in the accumulator, increment the count
      if (acc[item.Groupname]) {
        acc[item.Groupname]++;
      } else {
        // If it's the first occurrence of this Groupname, set the count to 1
        acc[item.Groupname] = 1;
      }
      return acc;
    }, {}); // Initialize the accumulator as an empty object
  };
  
  // Get the verified counts by Groupname
  const verifiedCountsByGroupname = countVerifiedByGroupname(VerifiedDetail);
  
 
  const countNotVerifiedByGroupname = (NotVerifiedDetail) => {
    return NotVerifiedDetail.reduce((acc, item) => {
      // If the Groupname is already in the accumulator, increment the count
      if (acc[item.Groupname]) {
        acc[item.Groupname]++;
      } else {
        // If it's the first occurrence of this Groupname, set the count to 1
        acc[item.Groupname] = 1;
      }
      return acc;
    }, {}); // Initialize the accumulator as an empty object
  };
 

  // Get the verified counts by Groupname
  const NotverifiedCountsByGroupname = countNotVerifiedByGroupname(NotVerifiedDetail);



  const categories = 
  Object.keys(NotverifiedCountsByGroupname).length >= Object.keys(verifiedCountsByGroupname).length
   ? Object.keys(NotverifiedCountsByGroupname) : Object.keys(verifiedCountsByGroupname)

  // Extract the passed and failed counts
  const passedData = categories.map(category => verifiedCountsByGroupname[category]);
  const failedData = categories.map(category => NotverifiedCountsByGroupname[category]);
  
  // Create annotations (these will be the same as the counts in string format)
  const passedAnnotations = passedData.map(String);  // Convert passed data to strings
  const failedAnnotations = failedData.map(String);  // Convert failed data to strings
  
  // Data format for Google Charts
  const data = [
    ['Payer-wise', 'Passed', { role: 'annotation' }, 'Failed', { role: 'annotation' }], // Column names
    ...categories.map((category, index) => [
      category,                       // Payer-wise name
      passedData[index],              // Passed data count
      passedAnnotations[index],       // Passed annotations
      failedData[index],              // Failed data count
      failedAnnotations[index]        // Failed annotations
    ])
  ];
  

  // Chart options for Google Charts Line Chart
  const options = {
    title:'Payer wise Passed & Failed',
    titleTextStyle: {
      fontSize: 12,
      color: '#000',
      bold: true,
    },
    fill: {
      type: "gradient",
     /*  gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 3.9,
        stops: [40, 90, 100]
      } */
    },
    hAxis: { title: 'Payer',  textStyle: {
      fontSize: 10,
      color: '#222',
      bold: true,
    }, },
    vAxis: { title: 'Count',  textStyle: {
      fontSize: 10,
      color: '#222',
      bold: true,
    }, },
    colors: ['#e040fb', '#d7ccc8'],  // Color for passed and failed data
    curveType: 'function',  // Smooth curves for the line chart
    annotations: {
       style: 'point',
      textStyle: {
        fontSize: 8,
        color: '#000',
        bold: true,
      },
      // Adding annotations for passed and failed data points
      series: {
        0: { annotations: passedAnnotations.map((annotation, index) => ({
          x: categories[index],
          y: passedData[index],
          text: annotation,
        })) },
        1: { annotations: failedAnnotations.map((annotation, index) => ({
          x: categories[index],
          y: failedData[index],
          text: annotation,
        })) },
      },
    },
    tooltip: {
      isHtml: true, // Allow HTML content in tooltips
      trigger: 'focus',  // Trigger on selection of data points
      textStyle: {
        fontSize: 12,
      },
      // Custom tooltip format
      // Display the tooltip for both passed and failed data points.
      Trigger: 'both',  // Show tooltip on both hover and selection
      format: 'value', // Format of the value in tooltip
      // You can also define custom content for tooltips here, based on data points
    },
    legend: { position: 'right' },
    chartArea: { width: '80%', height: '70%' },
    // You can also configure chart interactivity here, if needed
    focusTarget: 'category',  // Allows focusing on the whole category
  };
  

  const chartRef = useRef();

  // Function to export data and image to Excel
  const exportToExcel = () => {
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
          { name: 'Payer', filterButton: true },
          { name: 'Passed', filterButton: true },
          { name: 'Failed', filterButton: true },
        ],
        rows: categories.map((category, index) => [
          category,
          passedData[index],
    
          failedData[index],
        ]),
      });

      const worksheetImage = workbook.addWorksheet('Image');
      // Add image to Excel (using base64 image)
      const imageId = workbook.addImage({
        base64: imgData,
        extension: 'png',
      });

      worksheetImage.addImage(imageId, 'A1:J30'); // Position image in Excel

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
    const headers = ['Payer', 'Passed', 'Failed'];
    const rows = categories.map((category, index) => [
      category,
      passedData[index],
      failedData[index],
    ]);

    // Convert the data to CSV format
    const csvContent = [
      headers.join(','), // Add the header row
      ...rows.map((row) => row.join(',')) // Map the rows to CSV format
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
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleExport = (e) => {
    const value = e.target.value;
    setSelectedOption(value);

    if (value === 'excel') {
      exportToExcel();
    } else if (value === 'csv') {
      exportToCSV();
    }
  };

  return (
    <div>
      <div>
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
        {isMenuOpen && (
          <select 
            value={selectedOption} 
            onChange={handleExport} 
            style={{
              padding: '8px',
              width: '60%',
              fontSize: '14px',
              margin: '5px 20%',
            }}
          >
            <option value="">Select Export Option</option>
            <option value="excel">Export to Excel</option>
            <option value="csv">Export to CSV</option>
          </select>
        )}
      </div>

      <div ref={chartRef} style={{ position: 'relative', width: '100%',paddingTop:25, height: '350px' }}>
        <Chart
          chartType="AreaChart"
          data={data}
          options={options}
          width="100%"
          height="375px"
          
        />
      </div>
    </div>
  );
}

export default PayerWise;
