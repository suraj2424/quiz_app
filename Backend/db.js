const mongoose = require('mongoose');
async function mongoConnect(mongoURL){
    try{
        await mongoose.connect(mongoURL).then(()=>console.log("Connected to MongoDB"))
    }
    catch(e) {
        console.log("Error: ",e)
    }
}

module.exports = mongoConnect