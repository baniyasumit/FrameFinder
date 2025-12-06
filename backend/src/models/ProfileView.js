import mongoose from 'mongoose'

const profileViewSchema = new mongoose.Schema({
    viewerId: {
        type: String,
        required: true
    },
    portfolioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Portfolio',
        required: true
    },
    viewedAt: {
        type: Date,
        default: Date.now,
    },
    isAnonymous: { type: Boolean, default: false },

})

export default mongoose.model("ProfileView", profileViewSchema);
