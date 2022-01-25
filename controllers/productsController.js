const { db, dbQuery } = require('../config/database')

module.exports = {

    getProducts: async (req, res) => {
        try {
            // fungsi db.query

            let filterQuery = []

            for (let prop in req.query) {
                filterQuery.push(`${prop == "name" ? `p.${prop}` : prop}=${db.escape(req.query[prop])}`)
            }
            console.log(filterQuery)
            let getSQL = `SELECT p.*, b.brand, c.category from products p 
            JOIN brand b ON p.idbrand = b.idbrand 
            JOIN category c on p.idcategory = c.idcategory 
            ${filterQuery.length > 0 ? `WHERE ${filterQuery.join(' AND ')}` : ""};`

            console.log(getSQL)

            let resultsProducts = await dbQuery(getSQL)

            let resultsImage = await dbQuery(`SELECT * FROM commerce.images;`)
            let resultsStock = await dbQuery(`SELECT * FROM commerce.stocks;`)

            resultsProducts.forEach((value, index) => {
                value.images = [];
                value.stocks = [];

                resultsImage.forEach(val => {
                    if (value.idproduct == val.idproduct) {
                        delete val.idproduct
                        value.images.push(val)
                    }
                })

                resultsStock.forEach(val => {
                    if (value.idproduct == val.idproduct) {
                        delete val.idproduct
                        value.stocks.push(val)
                    }
                })

            })

            res.status(200).send({
                success: true,
                message: "Get data products success",
                dataProducts: resultsProducts,
                error: ""
            })

        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Failed",
                error: error
            })
        }
    },
    addProducts: async (req, res) => {
        try {
            // untuk menyimpan data products, table yang berpengaruh adalah tabel product, images, stocks
            let { idbrand, idcategory, name, description, price, images, stocks } = req.body

            let insertProducts = await dbQuery(`INSERT INTO products values
            (null, ${db.escape(idbrand)}, ${db.escape(idcategory)}, ${db.escape(name)}, ${db.escape(description)}, ${db.escape(price)}, 'Active');`)
            
            // res.status(200).send(insertProducts)
            
            if (insertProducts.insertId) {
                // lanjut add data tables images dan juga stock

                await dbQuery(`INSERT INTO commerce.images values ${images.map((val) => `(null, ${insertProducts.insertId}, "${val}")`).toString()}`)
                await dbQuery(`INSERT INTO commerce.stocks values ${stocks.map((val) => `(null, ${insertProducts.insertId}, "${val.type}", ${val.qty})`).toString()}`)
                
                // let insertImages = images.map(val )
                // images.forEach(val => {
                //     insertImages.push(`(null, ${insertProducts.insertId}, "${val}")`)
                // })

                // let insertStocks = []
                // stocks.forEach(val => {
                //     insertStocks.push(`(null, ${insertProducts.insertId}, "${val.type}", ${val.qty} )`)
                // })

                // console.log(`INSERT INTO commerce.images values ${insertImages.toString()}`)
                // console.log(`INSERT INTO commerce.stocks values ${insertStocks.toString()}`)

                // let addImages = await dbQuery(`INSERT INTO commerce.images values ${insertImages.toString()};`)
                // let addStocks = await dbQuery(`INSERT INTO commerce.stocks values ${insertStocks.toString()};`)
                res.status(200).send({
                    success: true,
                    message: "Insert Products Success",
                    error: ""
                })
            } 

            


        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: false,
                message: "Failed",
                error: error
            })
        }

    },

    getData: (req, res) => {
        console.log("Middleware Products")
        let getSQL = `SELECT p.*, b.brand, c.category from products p 
        JOIN brand b ON p.idbrand = b.idbrand 
        JOIN category c on p.idcategory = c.idcategory ${req.query.id ? `where idproduct=${parseInt(req.query.id)}` : ``};`

        db.query(getSQL, (err, results) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: "Failed",
                    error: err
                })
            }
            let getImages = `SELECT * from commerce.images`;
            db.query(getImages, (errImg, resultsImg) => {
                if (errImg) {
                    res.status(500).send({
                        success: false,
                        message: "Failed",
                        error: err
                    })
                }
                // get images product dari table images
                // cocokkan idproduct dari tabel products dengan tabel images
                // kemudian idproduct yang sesuai akan menjadi properti baru dari results products
                results.forEach((valRes) => {
                    valRes.images = []
                    resultsImg.forEach(valImg => {
                        if (valRes.idproduct == valImg.idproduct) {
                            delete valImg.idproduct
                            valRes.images.push(valImg)
                        }
                    })
                })
                let getStock = `SELECT * from commerce.stocks`;
                db.query(getStock, (errStock, resultsStock) => {
                    if (errStock) {
                        res.status(500).send({
                            success: false,
                            message: "Failed",
                            error: err
                        })
                    }
                    results.forEach((valRes) => {
                        valRes.stock = []
                        resultsStock.forEach(valStock => {
                            if (valRes.idproduct == valStock.idproduct) {
                                delete valStock.idproduct
                                valRes.stock.push(valStock)
                            }
                        })
                    })
                    res.status(200).send({
                        success: true,
                        message: "Get data products success",
                        dataProducts: results,
                        error: ""
                    })
                })
            })



        })

        // db.query(
        //     `Select idproduct, idbrand, name, description, price from products;`,
        //     (err, results) => {
        //         if (err) {
        //             console.log(err)
        //             res.status(400).send(err)
        //         };
        //         res.status(200).send(results);
        //     })
    },
}