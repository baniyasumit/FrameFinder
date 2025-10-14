import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Portfolio',
        required: true
    },
    service: {
        title: { type: String, required: true },
        description: { type: String },
        features: [String]
    },
    sessionStartDate: {
        type: Date,
        required: true
    },
    sessionEndDate: {
        type: Date,
        required: true
    },
    venueName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    guestNumber: {
        type: Number,
    },
    eventDescription: {
        type: String,
    },
    specialRequest: {
        type: String,
    },
    totalCharge: {
        standardCharge: {
            type: Number,
            required: true
        },
        packageCharge: {
            type: Number,
            required: true
        },
        duration: {
            type: Number,
            required: true,
            default: 1
        },
        total: {
            type: Number,
        }
    },
    payment: {
        status: {
            type: String,
            enum: ['unpaid', 'partial', 'paid'],
            default: 'unpaid',
        },
        paid: {
            type: Number,
            required: true,
            default: 0,
        },
        remaining: {
            type: Number,
            required: true,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bookingStatus: {
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined', 'cancelled', 'completed'],
            default: 'pending',
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
})

bookingSchema.pre('save', function (next) {
    this.totalCharge.total = (this.totalCharge.duration * this.totalCharge.packageCharge) + this.totalCharge.standardCharge;
    if (this.isModified('bookingStatus.status')) {
        this.bookingStatus.date = new Date();
    }
    next();
});


export default mongoose.model("Booking", bookingSchema);
