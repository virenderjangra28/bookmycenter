"use client";

import { useEffect, useState } from "react";

function mapCountryForSave(country) {
    return {
        name: country.name,
        code: country.code ?? country.numericCode,
        flag: country.flag,
        flags: country.flags,
        ...(country.cioc ? { cioc: country.cioc } : {}),
    };
}

export default function Country() {
    const [countries, setCountries] = useState([]);
    const [savedCount, setSavedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const loadSavedCount = async () => {
        const response = await fetch("/api/countrylist?source=db");
        const data = await response.json();
        if (Array.isArray(data)) {
            setSavedCount(data.length);
        }
    };

    useEffect(() => {
        Promise.all([
            fetch("/api/countrylist").then((response) => response.json()),
            fetch("/api/countrylist?source=db").then((response) => response.json()),
        ])
            .then(([externalData, dbData]) => {
                setCountries(Array.isArray(externalData) ? externalData : []);
                setSavedCount(Array.isArray(dbData) ? dbData.length : 0);
            })
            .catch((fetchError) => setError(fetchError))
            .finally(() => setLoading(false));
    }, []);

    const saveCountriesToDatabase = async () => {
        if (countries.length === 0) {
            setError(new Error("No countries loaded to save."));
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const payload = countries.map(mapCountryForSave);
            const response = await fetch("/api/countrylist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to save countries");
            }

            await loadSavedCount();
            alert(
                `Saved ${data.saved} countries (${data.inserted} new, ${data.updated} updated).`
            );
        } catch (saveError) {
            setError(saveError);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h1>Countries</h1>
            <p>
                Loaded from API: {countries.length} | Saved in database: {savedCount}
            </p>
            <button
                style={{
                    marginRight: "10px",
                    backgroundColor: "blue",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                }}
                onClick={saveCountriesToDatabase}
                disabled={saving || loading}
            >
                {saving ? "Saving..." : "Save All Countries to Database"}
            </button>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error.message}</p>
            ) : (
                <ul>
                    {countries.map((country) => (
                        <li key={country.code || country.name}>{country.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
