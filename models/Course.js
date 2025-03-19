const mongoose = require('mongoose');


const lectureSchema = new mongoose.Schema({
    title: {
        typeof: String,
        required: true
    },
    description: {
        type: String,
    },
    videoUrl: {
        type: String,
    },
    duration: {
        type: Number,
    },
    isPreview: {
        type: Boolean,
        default: false
    },
    resources: [
        {
            name: String,
            fileUrl: String,
            fileType: String,
        }
    ],
});