export const citylist = async (countryName, stateName) => {
  const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      country: countryName,
      state: stateName,
    }),
  });
  const data = await response.json();
  return Array.isArray(data?.data) ? data.data : [];
};
