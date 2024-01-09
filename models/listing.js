const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User  = require("./user.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default:"Listing Image",
      required: true,
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) => (v && v !== "" ? v : "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
      required: true,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {type:Schema.Types.ObjectId,
    ref:"Review",}
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
   
  geometry:{
    type :{
      type:String ,
      enum:["Point"],
      require:true,
      },
      "coordinates":{
        type:[Number],
      required:true,
    }
    }
  

});

listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
  await Review.deleteMany({_id: {$in : listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
