var express			= require("express"),
	app			= express(),
	mongoose 		= require("mongoose"),
	bodyParser		= require("body-parser"),
	flash			= require("connect-flash"),
	methodOverride		= require("method-override"),
	Campground		= require("./models/campground"),
	Comment			= require("./models/comment"),
	User			= require("./models/user"),
	seedDB			= require("./seeds"),
	passport		= require("passport"),
	LocalStrategy		= require("passport-local");

//requiring routes
var commentRoutes		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes		= require("./routes/index");

// seedDB();  //seed the DB

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment=require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "I will keep it secret",
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect("mongodb+srv://aash:aash2906%23@cluster0-kmqxp.mongodb.net/yelpcamp?retryWrites=true&w=majority",{
	useNewUrlParser :true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
}).then(()=>{
	console.log("connected to db");
}).catch(err =>{
	console.log("error",err.message);
});

app.use(function(req,res,next){
	res.locals.currentUser 		= req.user;
	res.locals.error		= req.flash("error");
	res.locals.success		= req.flash("success");

	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000 , process.env.IP , function(){
	console.log("YelpCamp server has started");
});

