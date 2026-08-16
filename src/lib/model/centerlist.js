import mongoose from "mongoose";

const centerlistSchema = new mongoose.Schema({
    user_id: { 
        type: String,
        ref: "User"
    },
    centerName: { 
        type: String, 
        required: true 
    },
    centerType: { 
        type: String, 
        required: true 
    },
    owner: { 
        type: String, 
        ref: "User",
    },
    capacity: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        ref: "Country",
        required: true 
    },
    State: { 
        type: String,
        ref: "State"
    },
    city: { 
        type: String, 
        ref: "City"
    },
    phone: {    
         type: String, 
         required: true },
    longitude: { 
        type: String, 
        required: true 
    },
    latitude: { 
        type: String, 
        required: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false,
    },
    address: { 
        type: String, 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true,
        default: Date.now
    },
    endDate: { 
        type: Date, 
        required: true,
        default: Date.now
    },
    startTime: { 
        type: Date, 
        required: true 
    },
    endTime: { 
        type: Date, 
        required: true,
        default: Date.now
    },
    washroomPhoto: { 
        type: String, 
        required: true 
    },
    mainEntryPhoto: { 
        type: String, 
        required: true 
    },
    others: { 
        type: String, 
        required: true 
    },
    availability: { 
        type: String, 
    },
    applicationData: {
        type: mongoose.Schema.Types.Mixed,
    }
}, { collection: "centerLists", strict: false });

export const Centerlist = mongoose.models.Centerlist || mongoose.model("Centerlist", centerlistSchema);

export default Centerlist;