import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Country from "@/lib/model/country";

function normalizeCountry(input) {
    const code = input.code ?? input.numericCode;

    if (!input.name || code == null || !input.flag || !input.flags?.png || !input.flags?.svg) {
        return null;
    }

    return {
        name: input.name,
        code: String(code),
        flag: input.flag,
        flags: {
            png: input.flags.png,
            svg: input.flags.svg,
        },
        ...(input.cioc ? { cioc: input.cioc } : {}),
    };
}

export async function GET(request) {
    const source = request.nextUrl.searchParams.get("source");

    if (source === "db") {
        try {
            await connectDB();
            const countries = await Country.find().sort({ name: 1 }).lean();
            return NextResponse.json(countries);
        } catch (error) {
            return NextResponse.json(
                { error: error.message || "Failed to fetch countries from database" },
                { status: 500 }
            );
        }
    }

    try {
        const response = await fetch("https://countries.dev/countries");
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch countries" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const countries = Array.isArray(body) ? body : [body];
        const payload = countries.map(normalizeCountry).filter(Boolean);

        if (payload.length === 0) {
            return NextResponse.json(
                { error: "No valid countries to save" },
                { status: 400 }
            );
        }

        const operations = payload.map((country) => ({
            updateOne: {
                filter: { code: country.code },
                update: { $set: country },
                upsert: true,
            },
        }));

        const result = await Country.bulkWrite(operations, { ordered: false });

        return NextResponse.json(
            {
                success: true,
                saved: payload.length,
                inserted: result.upsertedCount,
                updated: result.modifiedCount,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/countrylist failed:", error);

        return NextResponse.json(
            { error: error.message || "Failed to create country" },
            { status: 500 }
        );
    }
}
