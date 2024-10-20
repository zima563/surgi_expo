const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            trim: true,
            required: [true, "name is required"],
            minlength: [2, "Too short name"],
            maxlength: [1000, "Too long name"],
        },
        slug: {
            type: String,
            lowercase: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            required: [true, "name is required"],
            minlength: [2, "Too short name"],
            maxlength: [1000, "Too long name"],
        },
        brief: {
            type: String,
        },
        imgCover: String,
        images: [
            {
                type: String,
            },
        ],
        category: {
            type: mongoose.Types.ObjectId,
            ref: "category",
        },
    },
    { timestamps: true }
);

schema.post(/^find/, (doc) => {
    if (doc.imgCover || doc.images) {
        doc.imgCover = process.env.MEDIA_BASE_URL + doc.imgCover;
        doc.images = doc.images?.map((val) => process.env.MEDIA_BASE_URL + val);
    }
});


schema.pre("findOne", function () {
    this.populate("category");
});

schema.pre("find", function () {
    this.populate("category");
});

schema.pre("findOne", function () {
    this.populate("category.parentId");
});

schema.pre("find", function () {
    this.populate("category.parentId");
});
const productModel = mongoose.model("product", schema);

module.exports = productModel;