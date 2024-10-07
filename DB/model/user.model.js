const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: [true, "name is required"],
        minlength: [2, "Too short name"],
        maxlength: [50, "Too long name"],
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
    }
});

userSchema.pre("save", function () {
    if (this.password) this.password = bcrypt.hashSync(this.password, 8);
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;