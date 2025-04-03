const mongoose = require('mongoose');

//Category
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    },
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

//Virtuals for Subcategories
categorySchema.virtual("subcategories", {
    ref: "Category",
    localField: "_id",
    foreignField: "parentCategory",
});

//Virtuals for Courses
categorySchema.virtual("courses", {
    ref: "Course",
    localField: "_id",
    foreignField: "category",
});

//Pre-validate hook that check or create slug from name
categorySchema.pre("validate", function(next) {
    if(this.name && !this.slug) {
        this.slug = this.name.toLowerCase().trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

