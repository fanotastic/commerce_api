const express = require('express')
const app = express();
const cors = require('cors')
const dotenv = require('dotenv');
const { db } = require('./config/database');
dotenv.config();

const PORT = process.env.PORT;
app.use(cors())
app.use(express.json());

// DB Check Connection
db.getConnection((err, connection) => {
    if(err) {
        console.log(`Error MySQL Connection: `, err.message)
    }

    console.log(`Connected to MySQL Server: ${connection.threadId}`)
} )

// Routes API Setup
app.get('/', (req, res) => res.status(200).send("<h2>Welcome to commerce api</h2>"));

const { usersRoute } = require('./routes')
app.use('/users', usersRoute);

app.listen(PORT, () => console.log('Ecommerce API Ready! : ', PORT))

//config error handling
// app.use((data) => {
//     console.log(data)
// } )
