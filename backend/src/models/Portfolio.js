import mongoose from 'mongoose'

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    specialization: {
        type: String
    },
    serviceTypes: {
        type: [String]
    },
    standardCharge: {
        type: Number
    },
    bio: {
        type: String,
        maxlength: 1000,
    },
    about: {
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
    ratingStats: {
        averageRating: {
            type: Number,
            default: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        },
    },
})

portfolioSchema.index({ location: "2dsphere" });

portfolioSchema.pre('save', function (next) {
    this.modifiedAt = Date.now();
    next();
});

export default mongoose.model("Portfolio", portfolioSchema);
