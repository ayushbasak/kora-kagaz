const mongoose = require('mongoose');
async function connectDB(){
    await mongoose.connect('mongodb://mongo:27017/node-docker', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(console.log('connected to database'))
        .catch(error => console.log(error));
}

module.exports = connectDB;