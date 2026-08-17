import mongoose from "mongoose";

const BankingDetailSchema = new mongoose.Schema({
    
    userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        accountName: String,
        bankName: String,
        accountNumber: String,
        ifscCode: String,
        branchName: String,
        cancelCheckPhotos: {
            checkPhoto: String,
        },
        created_at: { type: Date, default: Date.now }
    }, { collection: "bankingDetails" });

export const BankingDetail = mongoose.models.BankingDetail || mongoose.model("BankingDetail", BankingDetailSchema);

export default BankingDetail;