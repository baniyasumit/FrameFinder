import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    platformFee: {
        type: Number,
        default: 0,
    },
    netAmount: {
        type: Number,
        default: 0,
    },
    calculatedStatus: {
        type: Boolean,
        default: false
    },
    paymentType: {
        type: String,
        enum: ["booking_fee", "final_payment"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "succeeded", "cancelled", "refunded"],
        default: "pending",
    },
    stripePaymentIntentId: {
        type: String,
    },
    clientSecret: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
    refundInfo: {
        stripeRefundId: String,
        amount: Number,
        reason: {
            type: String,
            enum: ["cancelled_by_client", "cancelled_by_photographer"],
        },
        refundedOn: Date,
    }
});

paymentSchema.pre('save', function (next) {
    this.lastUpdated = Date.now();
    next();
});


paymentSchema.index({ createdOn: -1 });

export default mongoose.model("Payment", paymentSchema);
