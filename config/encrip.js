const jwt = require("jsonwebtoken");
const Crypto = require('crypto');

module.exports = {
    hashPassword: (pass) => {
        return Crypto.createHmac("sha256", process.env.CRYPTO_KEY).update(pass).digest("hex");
    },
    createToken: (payload) => {
        return jwt.sign(payload, process.env.TOKEN_KEY, {
            expiresIn: "12h"
        })

    },
    readToken: (req, res, next) => {
        console.log(req.token)
        jwt.verify(req.token, process.env.TOKEN_KEY, (err, decode) => {
            if (err) {
                res.status(401).send({
                    messages: "user not authorization",
                    success: false,
                    error: err
                })
            }
            //hasil penerjemahan code
            console.log(decode)
            req.dataUser = decode

            next()
        })
    }
};

// Encode : menerjemahkan data asli menjadi data acak baru
// Decode : menerjemahkan data acak menjadi data asli