import mongoose from 'mongoose'


const portfolioPictureSchema = new mongoose.Schema({
    url: { type: String, required: true },
    secretUrl: { type: String, required: true },
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('PortfolioPicture', portfolioPictureSchema);