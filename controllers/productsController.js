const { db } = require('../config/database')

module.exports = {
    getData: (req, res) => {
        db.query(
            `Select idproduct, idbrand, name, description, price from products;`,
            (err, results) => {
                if (err) {
                    console.log(err)
                    res.status(400).send(err)
                };
                res.status(200).send(results);
            })
    },
    addProducts: (req, res) => {
        let { idbrand, name, description, price } = req.body
        let insertSQL =
            `Insert into products (idbrand, name, description, price) values (${idbrand}, ${db.escape(name)}, ${db.escape(description)}, ${db.escape(price)});`

        db.query(insertSQL, (err, results) => {
            if (err) {
                console.log(err)
                res.status(400).send(err)
            };
            res.status(200).send(results);
        })
    }
}