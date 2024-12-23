 if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
 }

const express = require("express");
const app= express();
const mongoose= require("mongoose");
const port=8080;
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore= require("connect-mongo");
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const user= require("./models/user.js");

const listingsrouter= require("./routes/listing.js");
const reviewsrouter= require("./routes/review.js");
const userrouter= require("./routes/user.js");
 
const dburl= process.env.ATLAS_DB;
// "mongodb://127.0.0.1:27017/wondarlust"
main().then(()=>{
    console.log("connected db");
}).catch((err)=>{
    console.log(err);
})
async function main() {
   await mongoose.connect(dburl);
}

app.set("view engine", "views");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));

const store= MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter:  24 * 3600,
});

store.on("error", ()=>{
    console.log("error in mongo session store", err);
});

const sessionOptions={
    store,
     secret:process.env.SECRET,
     resave: false, 
     saveUninitialized: true,
     Cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
     }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next();
});

app.use("/listings", listingsrouter);
app.use("/listings/:id/reviews", reviewsrouter);
app.use("/", userrouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
   let {statuscode=500,message="somting went wrong"}=err;
   res.status(statuscode).render("error.ejs", {message});
});

app.listen(port,()=>{
    console.log(`app is listnig on port ${port}`);
});




// app.get("/demouser",async(req,res)=>{
// let fakeuser= new user({
//     email:"studentemail1@gmail.com",
//     username: "demouser1",
// });
//   let registereduer= await user.register(fakeuser,"helloworld");
//   res.send(registereduer);
// });

// app.get("/textlisting",async(req,res)=>{
//     let samplelisting=new Listing({
//         title: "my new villa",
//         description: "by the beach",
//         price: 1200,
//         location: "banglor",
//         country: "india",
//     });
//     await samplelisting.save();
//     console.log("sample is saved");
//     res.send("successufully tested");
// });
