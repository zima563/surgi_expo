const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken")

const userModel = require("../../../DB/model/user.model");
const catchError = require("../../middlewares/catchError");
const apiError = require("../../utils/apiError");

const register = catchError(async (req, res, next) => {
    let user = new userModel(req.body);
    await user.save();
    res.json(user)
});

const login = catchError(async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        let token = JWT.sign({ userId: user._id }, process.env.JWT_KEY);
        return res.json({ token });
    }
    next(new apiError("email or password incorrect", 401));
})

const protectRoutes = catchError(async (req, res, next) => {
    let { authorization } = req.headers;
    if (!authorization) return next(new apiError("not token provide", 401));

    let token = authorization.replace("Bearer ", "");
    let decoded = JWT.verify(token, process.env.JWT_KEY);
    let user = await userModel.findById(decoded.userId);
    if (!user) return next(new apiError("user not founnd"));

    if (user.logoutAt) {
        let timeOflogout = parseInt(user?.logoutAt / 1000);
        if (timeOflogout > decoded.iat)
            return next(new apiError("invalid token..please login", 401));
    }
    req.user = user;
    next();
});

module.exports = {
    register,
    login,
    protectRoutes
}