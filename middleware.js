const Listing = require("./models/listing.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingschema, reviewschema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","you must login to create a new listing");
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl= (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl;
  };
  next();
};

module.exports.isOwner= async(req,res,next)=>{
  let {id}=req.params;
  let listing= await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error", "you are not the owner of this listing");
      return  res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validatelisting= (req,res,next)=>{
  let {error}= listingschema.validate(req.body);
  if (error){
      let errmsg= error.details.map((el)=> el.message).join(",");
      // console.log(errmsg);
      // console.log(req.body);
      // console.log(req.headers)
      throw new ExpressError(400, errmsg);
      
  }else{
      next();
  }
};

module.exports.validateReview= (req,res,next)=>{
    let {error}= reviewschema.validate(req.body);
    if (error){
        let errmsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor= async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review= await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "you are not the Author of this Review");
      return  res.redirect(`/listings/${id}`);
  }
  next();
}
