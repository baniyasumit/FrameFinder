const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    visible: { type: Boolean, default: true },
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
    createdAt: { type: Date, default: Date.now },
});

const Image = mongoose.model('Image', imageSchema);