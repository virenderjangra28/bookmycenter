export const statelist = async (countryName) => {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            country: countryName,
          }),
        
    })
    const data = await response.json();
    return Array.isArray(data?.data?.states) ? data.data.states : [];
   }