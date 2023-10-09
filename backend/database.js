const mongoose = require("mongoose");
const error = require("./middleware/error");

const connectDataBase = async () => {
    mongoose.set('strictQuery', true);
    console.log(process.env.DB_URI)
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    }).then((data) => {
        console.log(`MongoDb Connected with server:${data.connection.host}`)
    }).catch((error) => {
        console.log(error);
    }
    )
}

module.exports = connectDataBase;