const mongoose = require('mongoose');

const connectToDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
    }catch(err){
        console.log('Error in connecting DB', err.message);
    }
}

module.exports = connectToDB;