import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        flag: {
            type: String,
            required: true,
        },
        flags: {
            png: {
                type: String,
                required: true,
            },
            svg: {
                type: String,
                required: true,
            },
        },
        cioc: {
            type: String,
        },
        created_at: { type: Date, default: Date.now },
    },
    { collection: "countries" }
);

export const Country =
    mongoose.models.Country ||
    mongoose.model("Country", CountrySchema);

export default Country;
