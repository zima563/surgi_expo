const { string } = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            trim: true,
            required: [true, "name is required"],
            minlength: [2, "Too short name"],
            maxlength: [50, "Too long name"],
        },
        slug: {
            type: String,
            lowercase: true,
            required: true,
        },
        image: String,
        description: {
            type: String,
            trim: true,
            minlength: [10, "Too short name"],
            maxlength: [255, "Too long name"],
        },
        parentId: {
            type: mongoose.Types.ObjectId,
            ref: "category"
        }
    },
    { timestamps: true }
);


const categoryModel = mongoose.model("category", schema);

module.exports = categoryModel;