import mongoose from "mongoose";

const LegalRegistrationSchema = new mongoose.Schema({
    
    userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        gstNumber: String,
        panNumber: String,
        corporateNumber: String,
        legalRegistrationPhotos: {
            gst: [String],
            pan: [String],
            corporate: [String],
        },
        created_at: { type: Date, default: Date.now }
    }, { collection: "legalRegistrations" });

export const LegalRegistration = mongoose.models.LegalRegistration || mongoose.model("LegalRegistration", LegalRegistrationSchema);

export default LegalRegistration;