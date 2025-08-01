import mongoose from 'mongoose'

const ServiceSchema = new mongoose.Schema({
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Portfolio',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    price: Number,
    duration: String,
    features: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Service", ServiceSchema);
