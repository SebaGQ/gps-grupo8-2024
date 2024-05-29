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
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([01]\d|2[0-3]):?([0-5]\d)$/.test(v);
            },
            message: (props) => `${props.value} is not a valid time format!`,
        },
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([01]\d|2[0-3]):?([0-5]\d)$/.test(v);
            },
            message: (props) => `${props.value} is not a valid time format!`,
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
