import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        min: 0,
    },
    duration: {
        type: Number,
        min: 1,
    },
    features: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
});


serviceSchema.pre('save', function (next) {
    this.modifiedAt = Date.now();
    next();
});

export default mongoose.model('Service', serviceSchema);
