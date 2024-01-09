const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const {validateReview} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


//Reviews
//Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));
    
    //delete route
    
    router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));
  

module.exports = router;
 