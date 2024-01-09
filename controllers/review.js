const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","Review posted successfully!");
    console.log("new review saved");
    res.redirect(`/listings/${req.params.id}`);
    
    };


module.exports.deleteReview = async (req, res) => {
    let id = req.params.id.trim();

    let reviewId = req.params.reviewId.trim();

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
};