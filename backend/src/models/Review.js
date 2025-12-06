import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,

    },
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    reviewedAt: {
        type: Date,
        default: Date.now,
    }
})

export default mongoose.model("Review", reviewSchema);
