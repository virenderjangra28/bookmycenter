import mongoose from "mongoose";

const CenterAvailabilitySchema = new mongoose.Schema({
    
        userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        operatingDays: [String],
        operatingHoursFrom: String,
        operatingHoursTo: String,
        weekdayExams: { type: Boolean, default: false },
        weekendExams: { type: Boolean, default: false },
        multiDayExams: { type: Boolean, default: false },
        shortNoticeExams: { type: Boolean, default: false },
        created_at: { type: Date, default: Date.now }
    }, { collection: "centerAvailabilities" });

export const CenterAvilability = mongoose.models.CenterAvilability || mongoose.model("CenterAvilability", CenterAvailabilitySchema);

export default CenterAvilability;