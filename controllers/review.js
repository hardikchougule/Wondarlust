const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);
    newreview.author= req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","Review Created");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async(req,res,next)=>{
    let{id, reviewId}= req.params;

    Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); 
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};