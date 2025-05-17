const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("token", token, {
        httpOnly: true, // prevent in XSS attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevent in csrf attack
        maxAge: 7 * 24 * 60 * 1000
    });

    return token;
}

module.exports = generateTokenAndSetCookie;