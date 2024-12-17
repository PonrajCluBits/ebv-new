export const getLocation = async () => 
    new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const apiURL = `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=jsonv2`;
            fetch(apiURL)
              .then(response => response.json())
              .then(data => {
                resolve(data); // Resolve with the data from the API
              })
              .catch(error => {
                resolve([]); // Resolve with an empty array in case of an error
              });
          },
          (error) => {
            resolve([]); // Resolve with an empty array in case of geolocation error
          }
        );
      } else {
        resolve([]); // Resolve with an empty array if geolocation is not supported
      }
    });