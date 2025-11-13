import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    stripeId: {
        type: String,
        required: true,
        default: ""
    },
    totalEarned: {
        type: Number,
        required: true,
        default: 0,
    },
    onHold: {
        type: Number,
        required: true,
        default: 0,
    },
    totalWithdrawn: {
        type: Number,
        required: true,
        default: 0
    },
    availableBalance: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },

});

walletSchema.pre("save", function (next) {
    this.availableBalance = this.totalEarned - this.totalWithdrawn;
    this.lastUpdated = Date.now();
    next();
});


export default mongoose.model("Wallet", walletSchema);
