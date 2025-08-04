import mongoose from 'mongoose'

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    location: {
        type: String,
    },
    specialization: {
        type: String
    },
    bio: {
        type: String,
        maxlength: 1000,
    },
    experienceYears: {
        type: Number
    },
    happyClients: {
        type: Number
    },
    photosTaken: {
        type: Number
    },
    equipments: [String],
    skills: [String],
    socialLinks: {
        instagram: String,
        facebook: String,
        website: String,
    },
    availability: {
        days: {
            type: [String],
            enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            required: true
        },
        time: {
            from: { type: String, required: true },
            to: { type: String, required: true }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
})


portfolioSchema.pre('save', function (next) {
    this.modifiedAt = Date.now();
    next();
});

export default mongoose.model("Portfolio", portfolioSchema);
