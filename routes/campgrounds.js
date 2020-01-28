var express 	= require("express");
var router  	= express.Router();
var Campground 	= require("../models/campground");
var middleware	= require("../middleware");

//INDEX ROUTE
router.get("/", function(req,res){
	//console.log(req.user);
	Campground.find({},function(err,allcamps){
		if(err)
			console.log(err);
	 	else
	 		res.render("campgrounds/index",{campgrounds:allcamps , currentUser: req.user});
	});
});

//CREATE ROUTE
router.post("/",middleware.isLoggedIn,function(req,res){
	//get data from form and add to array
	var name=req.body.name;
	var price=req.body.price;
	var img=req.body.image;
	var desc = req.body.description;
	var author = {
		id:req.user._id,
		username:req.user.username
	};
	var newCampground={name:name,price:price,image:img,description:desc,author:author};
	
	//create a new campground and save to DB
	Campground.create(newCampground, function(err, newcamp){
		if(err)
			console.log(err);
		else
			// redirect back to campgrounds
			res.redirect("/campgrounds");
	});
	
});

//NEW ROUTE
router.get("/new" ,middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
})

//SHOW ROUTE
router.get("/:id" , function(req,res){
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground Not Found!");
			return res.redirect("back");
		}
		else{
			res.render("campgrounds/show",{campground:foundCampground});	
		}
	});
});

//EDIT ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		res.render("campgrounds/edit",{campground: foundCampground});
	});
});

//UPDATE ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find and update the correct cmapground
Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err)
			res.redirect("back");
		else
			//redirect to show page
			res.redirect("/campgrounds/"+req.params.id);
	});
});

//DESTROY ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/campgrounds");
		else
			res.redirect("/campgrounds");
	});
});


module.exports = router;