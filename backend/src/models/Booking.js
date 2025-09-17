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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    sessionStartTime: {
        type: String
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
        required: true
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
        platformCharge: {
            type: Number,
            required: true
        }
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    bookingStatus: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'canceled'],
        default: 'pending',
    }
})


export default mongoose.model("Booking", bookingSchema);
