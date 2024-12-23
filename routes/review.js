const express= require("express");
const router= express.Router({mergeParams: true});
const wrapasync= require("../utils/WrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}= require("../middleware.js");

const reviewcontroller= require("../controllers/review.js");
//post review
router.post("/",
    isLoggedIn,
     validateReview,
      wrapasync(reviewcontroller.createReview));


//delete review rout
router.delete("/:reviewId",
      isLoggedIn,
      isReviewAuthor,
     wrapasync(reviewcontroller.deleteReview));

module.exports= router;