import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    country: String,
        state: String,
        city: String,
        pinCode: Number,
        fullAddress: String,
        latitude: String,
        longitude: String,
        locationPhotos: {
            hall: [String],
            entrance: [String],
            washroom: [String],
        },
        created_at: { type: Date, default: Date.now }
    }, { collection: "locations" });

export const Location = mongoose.models.Location || mongoose.model("Location", LocationSchema);

export default Location;