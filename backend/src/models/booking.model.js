import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommonSpace",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
