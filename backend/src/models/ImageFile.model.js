import mongoose from "mongoose";

const imageFileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageData: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const ImageFile = mongoose.model("ImageFile", imageFileSchema);
export default ImageFile;
