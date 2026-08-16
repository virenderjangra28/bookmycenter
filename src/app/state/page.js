"use client";

import { useEffect, useState } from "react";



export default function State() {
    const [states, setStates] = useState([]);
    const [countryCode, setCountryCode] = useState("");
   const statelist = async (countryName) => {
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
    setStates(data.data.states);
   }

    return (
        <div style={{ margin: "20px", padding: "20px" }}>
            <h1>State</h1>
            <input type="text" style={{ margin: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} value={countryCode} placeholder="Enter country code" onChange={(e) => setCountryCode(e.target.value)} />
            <button style={{ margin: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} onClick={() => statelist(countryCode)}>Get State List</button>

<br />
            <ul>
                {states.map((state) => (
                    <li key={state.name}>{state.name}</li>
                ))}
            </ul>
        </div>
    );
}
