const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  };


module.exports.renderNewForm = (req, res) => {
    
    res.render("listings/new.ejs");
  };

module.exports.showlisting = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author",},}).populate("owner");
    let currUser  = res.locals.currentUser;
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
 
    res.render("listings/show.ejs", { listing,currUser });
  };

  module.exports.createNewListing = async (req, res) => {
    try {
      let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
       
      let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;
        console.log(req.body);
        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        req.flash("error", "Error creating a new listing");
        res.redirect("/listings");
    }
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    console.log("Before rendering edit.ejs", listing);
    res.render("listings/edit.ejs", { listing,originalImageUrl});
  };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !=="undefined"){
      let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};   
    await listing.save();
    }
   
    req.flash("success","listing updated successfully!");
    res.redirect(`/listings/${id}`);
  };
  
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted suceesfully!");
    res.redirect("/listings");
  };
    