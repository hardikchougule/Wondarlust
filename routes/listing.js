const express= require("express");
const router= express.Router();
const wrapasync= require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validatelisting}= require("../middleware.js");
const listingcontroller= require("../controllers/listing.js");
const multer  = require('multer');
const {storage}= require("../cloudeconfig.js");
const upload = multer({storage});

router
   .route("/")
   .get( wrapasync(listingcontroller.index))
   .post(isLoggedIn,upload.single('listing[image]'),validatelisting,
    wrapasync(listingcontroller.createListing)
);

//new route
router.get("/new", isLoggedIn, listingcontroller.rednernewForm);

router.route("/:id")
.get( wrapasync(listingcontroller.showListing))
.put( isLoggedIn,isOwner,upload.single('listing[image]'), validatelisting,wrapasync(listingcontroller.updateListing))
.delete(isLoggedIn,isOwner,wrapasync(listingcontroller.deleteListing));

//edit route
router.get("/:id/edit",
     isLoggedIn,
     isOwner,   
    wrapasync(listingcontroller.renderEditForm));

module.exports=router;
