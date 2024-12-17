export const getIp = async () => fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => data.ip)
  .catch(error => "");