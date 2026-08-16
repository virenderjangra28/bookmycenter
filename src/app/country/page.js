"use client";

import { useEffect, useState } from "react";

export default function Country() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCountries = async () => {
        try {
            const response = await fetch("/api/countrylist");
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            setError(error);
        }
    }

    useEffect(() => {
        fetchCountries();
    }, []);

    return (
        <div>
            <h1>Countries</h1>
            {loading ? <p>Loading...</p> : error ? <p>Error: {error.message}</p> : (
                <ul>
                    {countries.map((country) => (
                        <li key={country.id}>{country.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )

}