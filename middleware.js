const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        res.locals.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirect = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let currUser  = res.locals.currentUser;
    if (currUser && !listing.owner.equals(currUser._id)) {
    req.flash("error","You are not owner of this listing");
    return res.redirect(`/listings/${id}`);
    }
    next();
  
};



module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    
    }
    else{
        next();
    }
};

 module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
 
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let id = req.params.id.trim();
  
    let reviewId = req.params.reviewId.trim();
    let review = await Review.findById(reviewId);
   
    if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error","You are not owner of this review");
    return res.redirect(`/listings/${id}`);
    }
    next();
  
};