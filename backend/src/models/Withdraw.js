import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    }
});

withdrawSchema.pre('save', function (next) {
    this.lastUpdated = Date.now();
    next();
});




export default mongoose.model("Withdraw", withdrawSchema);
