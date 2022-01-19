const { db } = require('../config/database');

module.exports = {
    //next gunanya utk sambung ke fungsi selanjutnya yaitu middleware (kalau ada)
    getData: (req, res, next) => {
        db.query(
            `Select username, email, role, status from users;`,
            (err, results) => {
                if (err) {
                    console.log(err)
                    res.status(400).send(err)
                };
                res.status(200).send(results);
            })
    },
    register: (req, res) => {
        let { username, email, password } = req.body
        let insertSQL =
            `Insert into users (username, email, password) values
        (${db.escape(username)}, ${db.escape(email)}, ${db.escape(password)})`

        db.query(insertSQL, (err, results) => {
            if (err) {
                console.log(err)
                res.status(400).send(err)
            };
            res.status(200).send(results);
        })
    },
    login: (req, res) => {}
}