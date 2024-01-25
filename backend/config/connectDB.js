const mongoose = require('mongoose');

const connectDB = () => {
   mongoose.connect(process.env.DBconnect).then((con) => {
    console.log('MongoDB connected to host: '+ con.connection.host)
   })
}

module.exports = connectDB;