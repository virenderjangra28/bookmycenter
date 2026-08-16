import mongoose from "mongoose";

const StateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        countryCode: {
            type: String,
            required: true,
            unique: true,
        },
        countryName: {
            type: String,
            required: true,
        },
        cioc: {
            type: String,
        },
        created_at: { type: Date, default: Date.now },
    },
    { collection: "states" }
);

export const State =
    mongoose.models.State ||
    mongoose.model("State", StateSchema);

export default State;
