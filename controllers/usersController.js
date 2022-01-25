const { db } = require('../config/database');
const Crypto = require('crypto'); // untuk enkripsi/hashing
const { hashPassword, createToken } = require('../config/encrip')

module.exports = {
    //next gunanya utk sambung ke fungsi selanjutnya yaitu middleware (kalau ada)
    getData: (req, res, next) => {
        db.query(
            `Select username, email, password, role, status from users;`,
            (err, results) => {
                if (err) {
                    console.log(err)
                    res.status(400).send(err)
                };
                res.status(200).send(results);
            })
    },
    register: (req, res) => {
        //sha256 itu algoritma enkripsinya utk me random password
        let { username, email, password } = req.body
        // let hashPassword = Crypto.createHmac("sha256", "budi").update(password).digest("hex");
        // console.table({
        //     before: password,
        //     after: hashPassword
        // })
        let insertSQL =
            `Insert into users (username, email, password) values
        (${db.escape(username)}, ${db.escape(email)}, ${db.escape(hashPassword(password))})`

        let getSQL = `SELECT * from users WHERE email=${db.escape(email)};`

        db.query(getSQL, (errGet, resultsGet) => {
            if (errGet) {
                res.status(500).send({
                    success: false,
                    message: "Failed",
                    error: err
                });
            }
            // results tipe datanya array of object
            if (resultsGet.length > 0) {
                res.status(400).send({
                    success: false,
                    message: "Email exist.",
                    error: ""
                });
            } else {
                db.query(insertSQL, (err, results) => {
                    if (err) {
                        res.status().send({
                            success: false,
                            message: "Failed",
                            error: err
                        });
                    }
                    res.status(200).send({
                        message: "Register Success",
                        success: true,
                        error: ""
                    });
                })
            }
        })

        // db.query(insertSQL, (err, results) => {
        //     if (err) {
        //         res.status().send({
        //             success: false,
        //             message: "Failed",
        //             error: err
        //         });
        //     }
        //     res.status(200).send({
        //         message: "Register Success",
        //         success: true,
        //         error: ""
        //     });
        // })
    },
    login: (req, res, next) => {
        let { email, password } = req.body
        // let hashPassword = Crypto.createHmac("sha256", "budi").update(password).digest("hex");
        let loginSQL =
            `SELECT * from users where email=${db.escape(email)} AND password=${db.escape(hashPassword(password))};`
        db.query(loginSQL, (err, results) => {

            console.log("ini results length", results, "email", email, "pass", hashPassword(password))
            if (err) {
                res.status(500).send({
                    success: false,
                    message: "Failed",
                    error: err
                });
            };
            if (results.length > 0) {
                let { iduser, username, email, role, status } = results[0]
                let token = createToken({ iduser, username, email, role, status })
                res.status(200).send({
                    success: true,
                    message: "Login Success",
                    dataLogin: { username, email, role, status, token },
                    err: ""
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: "Login Failed",
                    dataLogin: {},
                    err: ""
                })
            }
        })
    },
    keepLogin: (req, res) => {
        console.log("data dec token", req.dataUser)
        let keepLoginScript = `Select * from users WHERE iduser=${db.escape(req.dataUser.iduser)};`

        db.query(keepLoginScript, (err, results) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: "Failed",
                    error: err
                });
            }
            if (results.length > 0) {
                let { iduser, username, email, password, role, status } = results[0]
                let token = createToken({ iduser, username, email, role, status })
                res.status(200).send({
                    success: true,
                    message: "Login Success",
                    dataLogin: { username, email, role, status, token },
                    err: ""
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: "Login Failed",
                    dataLogin: {},
                    err: ""
                })
            }
        })
    }
}