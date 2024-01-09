const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");


//mangoose setup
main().then(()=>{
    console.log("Conneted to db");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const initDB = async () =>{
    //delete all data in the database
    await Listing.deleteMany({});
    //create new data and save it into the database
    initData.data = initData.data.map((obj)=>({...obj,owner:'6591c3bd46bf669d5b514054'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
 initDB();

