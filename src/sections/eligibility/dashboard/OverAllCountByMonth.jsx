import React, { useState, useRef } from 'react';
import { Chart } from 'react-google-charts';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';
import OverAllCountByDay from './OverAllCountByDay';

const OverAllCountByMonth = (FilteredDetail,PayerFlagDetails,selectedFromDate,selectedToDate,selectPatientID,selectProvider) => {

    const [selectedMonth, setSelectedMonth] = useState(null); 

  
    /* 
    const monthfromName = selectedFromDate.format("MMM");
    const monthtoName = selectedToDate.format("MMM") */
   
    const VerifiedDetail = FilteredDetail.PayerFlagDetails.length > 0 ? (FilteredDetail.PayerFlagDetails ? FilteredDetail.PayerFlagDetails?.filter((data) => data?.isverifiedStatus === 'Verified').map((item) => ({
        isverifiedStatus: item?.isverifiedStatus,
        createdAt: item?.createdAt,
      })) : 0 ) 
    : (Array.isArray(FilteredDetail?.FilteredDetail) && FilteredDetail?.FilteredDetail.length > 0 ? FilteredDetail?.FilteredDetail?.filter((data) => data?.isverifiedStatus === 'Verified')
    .map((item) => ({
        isverifiedStatus: item?.isverifiedStatus,
        createdAt: item?.createdAt,
      })) : 0)
    
      const countVerifiedByMonth = (VerifiedDetail) => {
        const monthCount = {};
        if (Array.isArray(VerifiedDetail)) {
        // Iterate over each item in the data
        VerifiedDetail.forEach(item => {
          if (item?.isverifiedStatus === 'Verified') {
            // Get the month and year from createdAt date (format: YYYY-MM)
            const monthYear = new Date(item?.createdAt).toISOString().slice(0, 7); // "YYYY-MM"
      
            // Initialize the count if it's not already in the monthCount object
            if (!monthCount[monthYear]) {
              monthCount[monthYear] = 0;
            }
      
            // Increment the count for the given month
            monthCount[monthYear]++;
          }
        });
      
        return monthCount;
    }
      };
      
      // Get the count of verified statuses by month
      const verifiedCountsByMonth = countVerifiedByMonth(VerifiedDetail);
      
     

      const NotVerifiedDetail = FilteredDetail.PayerFlagDetails.length > 0 ? (FilteredDetail.PayerFlagDetails ? FilteredDetail.PayerFlagDetails?.filter((data) => data?.isverifiedStatus === "NotVerified").map((item) => ({
        isverifiedStatus: item?.isverifiedStatus,
        createdAt: item?.createdAt,
      })) : 0 ) 
    : (Array.isArray(FilteredDetail?.FilteredDetail) && FilteredDetail?.FilteredDetail.length > 0 ? FilteredDetail?.FilteredDetail?.filter((data) => data?.isverifiedStatus === "NotVerified")
    .map((item) => ({
        isverifiedStatus: item?.isverifiedStatus,
        createdAt: item?.createdAt,
      })) : 0)

      const countNotVerifiedByMonth = (NotVerifiedDetail) => {
        const monthCount = {};
        if (Array.isArray(NotVerifiedDetail)) {
        // Iterate over each item in the data
        NotVerifiedDetail.forEach(item => {
          if (item?.isverifiedStatus === 'NotVerified') {
            // Get the month and year from createdAt date (format: YYYY-MM)
            const monthYear = new Date(item?.createdAt).toISOString().slice(0, 7); // "YYYY-MM"
      
            // Initialize the count if it's not already in the monthCount object
            if (!monthCount[monthYear]) {
              monthCount[monthYear] = 0;
            }
      
            // Increment the count for the given month
            monthCount[monthYear]++;
          }
        });
      
        return monthCount;
    }
      };
      
      // Get the count of verified statuses by month
      const NotverifiedCountsByMonth = countNotVerifiedByMonth(NotVerifiedDetail);
      
       
      const calculateOverallCount = (verifiedCountsByMonth, NotverifiedCountsByMonth) => {
        const overallCount = {};
      
        // Iterate over the months in passedCount (or failedCount, since both will have the same months)
       if(verifiedCountsByMonth && NotverifiedCountsByMonth){
        Object.keys(verifiedCountsByMonth).forEach((monthYear) => {
          // Sum the passed and failed counts for this month
          const passed = verifiedCountsByMonth[monthYear] || 0; // Default to 0 if passedCount is missing
          const failed = NotverifiedCountsByMonth[monthYear] || 0; // Default to 0 if failedCount is missing
      
          // Store the sum in the overallCount object
          overallCount[monthYear] = passed + failed;
        });
    }else {
        console.error("Invalid data: One of the required objects is null or undefined.");
      }
    
        return overallCount;
      };
      
      // Calculate the overall count
      const overallCount = calculateOverallCount(verifiedCountsByMonth, NotverifiedCountsByMonth);
      
     
      // Function to format the month (e.g., '2024-12' => 'Dec')
const formatMonth = (monthYear) => {
    const [year, month] = monthYear.split('-');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[parseInt(month) - 1]; // Convert month to index and return month name
    
  };
  
  // Function to generate chart data from combined counts
  const generateChartData = (overallCount, verifiedCountsByMonth, NotverifiedCountsByMonth) => {
    const chartData = [['Month', 'Overall', 'Passed', 'Failed']]; // Header row
  
    const allMonths = Object.keys(overallCount);

    // Sort months based on the year and month
    allMonths.sort((a, b) => {
      const [yearA, monthA] = a.split('-');
      const [yearB, monthB] = b.split('-');
      return new Date(`${yearA}-${monthA}-01`) - new Date(`${yearB}-${monthB}-01`); // Sort by date
    });

    // Iterate over each month-year in the overallCount object
    allMonths.forEach((monthYear) => {
      // Format the month (e.g., '2024-12' -> 'Dec')
      const monthName = formatMonth(monthYear);
      
      // Get the overall, passed, and failed counts for this month
      const overall = overallCount[monthYear];
      const passed = verifiedCountsByMonth[monthYear] || 0; // Get passed count (default to 0 if not available)
      const failed = NotverifiedCountsByMonth[monthYear] || 0; // Get failed count (default to 0 if not available)
  
      // Add a row to the chart data
      chartData.push([monthName, overall, passed, failed]);
      
    });
  
    return chartData;
  };
  
  // Calculate the overall count
 // const overallCount = calculateOverallCount(passedCount, failedCount);
  
  // Generate the chart data for the chart
  const chartData = generateChartData(overallCount, verifiedCountsByMonth, NotverifiedCountsByMonth);
  
  const handleChartClick = (chartEvents) => {
    // Ensure that chartEvents is defined and that chartEvents.chart is a valid google.visualization.ChartWrapper instance
   
    const chart = chartEvents.chart;
    // Get the selected items from the chart using the Google Charts API
    const selectedItems = chartEvents?.props?.data?.getSelection(); // This should now work
  
    console.log("Selected Items: ", selectedItems);  // Log the selected items to debug
  
    // Check if any items are selected
    if (selectedItems.length > 0) {
      // Assuming the chart's selection is based on rows (month index)
      const selectedItem = selectedItems[0]; // Get the first selected item (it should contain row/column details)
  
      // The row index corresponds to the clicked bar (which in this case represents a month)
      const selectedRowIndex = selectedItem.row;
  
      // Array of months for mapping (assuming your data starts with "Oct")
      const months = ["Oct", "Nov", "Dec"];
  
      // Ensure the selectedRowIndex is within valid bounds (ignoring the header row)
      if (selectedRowIndex >= 1 && selectedRowIndex <= months.length) {
        const selectedMonthName = months[selectedRowIndex - 1];  // Adjusting for header row (row 0 is the header)
  
        // Set the selected month in state
        setSelectedMonth(selectedMonthName);
  
        console.log("Selected Month Name: ", selectedMonthName); // Log the selected month name for debugging
      } else {
        console.error("Invalid row index:", selectedRowIndex);  // Handle invalid index if the click is outside the month rows
      }
    } else {
      console.error("No item was selected");
    }
  };
  

    // Data for the chart
    const data = chartData
      
    // Chart options
    const options = {
        title: 'Overall, Passed, and Failed Count by Month (2024)',
        curveType: 'function',
        chartArea: {
          width: '65%',
          height: '70%',
        },
        seriesType: 'bars', // Default series type is bar chart for "Overall"
        series: {
          0: { color: '#7e57c2', type: 'bars' },  // "Overall" as bar chart '#7e57c2', '#e040fb', '#d7ccc8'
          1: { color: '#e040fb', type: 'line' },  // "Passed" as line chart
          2: { color: '#d7ccc8', type: 'line' },  // "Failed" as line chart
        },
        vAxis: {
          title: 'Count',
          minValue: 0,
          textStyle: {
            fontSize: 10, // Axis label font size
            bold: true,
            color: 'black',
          },
        },
        hAxis: {
          title: 'Month',
          textStyle: {
            fontSize: 10, // Axis label font size
            bold: true,
            color: 'black',
          },
        },
        annotations: {
          style: 'line', // Ensures annotations are visible even if bars are too short
          textStyle: {
            fontSize: 8, // Font size for the count values
            bold: true,
            color: 'black', // Count values in black
          },
        },
        stroke: {
          curve: 'smooth',
        },
        bar: {
          groupWidth: '75%', // Adjusts the width of the bars
        },
        isStacked: false, // Set to `false` to keep bars unstacked (for separate bars)
        /* chartEvents: [
            {
              eventName: 'select',  // Listen for the 'select' event when a user clicks on a bar
              callback: handleChartClick,
            },
          ], */
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
            const filteredData = data.map(row => row.filter((_, index) => index % 2 === 0));

            // Add data to Excel worksheet
            worksheet.addTable({
                name: 'DataTable',
                ref: 'A1',
                columns: [
                    { name: 'Month', filterButton: true },
                    { name: 'Overall', filterButton: true },
                    { name: 'Passed', filterButton: true },
                    { name: 'Failed', filterButton: true },
                ],
                rows: data.slice(1),
            });

            // Create a second worksheet for the image
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
        const headers = ['Month', 'Overall', 'Passed', 'Failed'];
        const rows = data.slice(1); // Skipping the header row

        // Convert the data to CSV format
        const csvContent = [
            headers.join(','), // Add the header row
            ...rows.map((row) => row.join(',')), // Map the rows to CSV format
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
    const [selectedOption, setSelectedOption] = useState('');
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
                            width: '70%',
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
            <div ref={chartRef}  style={{ position: 'relative', width: '100%', height: '350px' }}>
                <Chart
                    chartType="ComboChart"
                    data={data}
                    options={options}
                    width={ '100%'}
                    height={'100%'}
                    style={{ paddingTop: 2, fontSize: 10, color: '#212121' }}
                    chartEvents={[
                        {
                          eventName: "select", // Listen to the 'select' event
                          callback: handleChartClick, // Use the event handler
                        },
                      ]}
                />
            </div>
            {selectedMonth && (
        <OverAllCountByDay
          selectedMonth={selectedMonth}
        />
      )}
        </div>
    );
};



export default OverAllCountByMonth;
