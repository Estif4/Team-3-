import mongoose, { Schema } from "mongoose";
import { IUserDocument } from "./user.types";

const UserSchema = new Schema<IUserDocument>(
{
    // User basic information
    displayName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },


    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },


    password: {
        type: String,
        required: true,
        select: false
    },


    // User permission level
    role: {
        type: String,

        enum: [
            "ADMIN",
            "MEMBER",
            "VIEWER"
        ],

        default: "MEMBER"
    },


    // For UI avatar
    avatarColor: {
        type: String,
        default: "#3498db"
    },


    // Track activity
    lastSeenAt: {
        type: Date,
        default: Date.now
    },


    // Account status
    isActive: {
        type: Boolean,
        default: true
    }

},
{
    timestamps: true
});



export const User = mongoose.model<IUserDocument>(
    "User",
    UserSchema
);
