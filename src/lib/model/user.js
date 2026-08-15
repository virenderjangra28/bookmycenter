import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
        type : String,
        unique : true,
        required : true,
        trim : true,
        lowercase : true,
        validate : {
            validator : function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message : props => `${props.value} is not a valid email!`
        }
    },
    name: String,
    password: String,
    isVerified : {
        type : Boolean,
        default : false,
    },
    forgotPasswordToken : String,
    forgotPasswordTokenExpiry : Date,
    company: String,
    center: {
      name: String,
      address: String,
      city: String,
      state: String,
      seatingCapacity: Number,
      contactEmail: String,
      contactPhone: String,
      contactPerson: String,
      latitude: Number,
      longitude: Number,
    },
    verificationToken : String,
    verificationTokenExpiry : Date,
    isActive: { type: mongoose.Schema.Types.Mixed, default: 0 },
    role: { type: mongoose.Schema.Types.Mixed, default: 0 },
    mobile: String,
    created_at: { type: Date, default: Date.now }
  },
);

export const User = mongoose.models.users || mongoose.model("users", userSchema);
