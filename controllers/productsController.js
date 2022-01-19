const { db } = require('../config/database')

module.exports = {
    getData: (req, res) => {
        db.query(
            `Select name, description, price from users;`,
            (err, results) => {
                if (err) {
                    console.log(err)
                    res.status(400).send(err)
                };
                res.status(200).send(results);
            })
    },
    addProducts: (req, res) => {
        
    }
}