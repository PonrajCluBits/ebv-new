export const getCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    const data = await response.json();
    const filteredCountries = data
      .filter(country => country.idd && country.idd.root && country.idd.suffixes && country.idd.suffixes.length > 0)
      .map((country, index) => ({
        id: index, // Assign sequential IDs
        name: country.name.common,
        code: country.cca2,
        dial_code: country.idd.root + country.idd.suffixes[0]
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort by country name in ascending order
    return filteredCountries;
  } catch (error) {
    console.error('Error fetching country data:', error);
    return [];
  }
};
