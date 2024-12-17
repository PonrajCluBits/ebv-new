export const fetchUsers = async () => {
    const response = await fetch('https://dev-ebv-backend-ffafgsdhg8chbvcy.southindia-01.azurewebsites.net/dashboard/view');
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    return response.json();
  };
  