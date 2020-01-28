const mongoose 	= require("mongoose");

//SCHEMA SETUP 
var CampgroundSchema = new mongoose.Schema({
	name : String,
	price: String,
	image: String,
	description : String,
	createdAt: {type:Date,default:Date.now},
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	comments: [{
		type:mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

var  Campground =  mongoose.model("Campground",CampgroundSchema);
module.exports =  Campground;
