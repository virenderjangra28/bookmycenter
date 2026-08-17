import mongoose from "mongoose";

const ComplianceDeclarationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    authorityName: String,
    authorityDesignation: String,
    authDate: Date,
}, { collection: "complianceDeclarations", strict: false });

export const CompDeclaration = mongoose.models.CompDeclaration || mongoose.model("CompDeclaration", ComplianceDeclarationSchema);

export default CompDeclaration;