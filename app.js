var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");

var express = require("express");
var app = express();
mongoose.connect("mongodb://localhost/blogapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
    title:String,
    image: String,
    body:String,
    created: {type:Date, default: Date.now}
})
var Blog = mongoose.model("Blog",blogSchema)
// Blog.create({title: "UMflint", image:"https://www.umflint.edu/sites/default/files/users/mcaudle/60.logo_.final_.small_.png",body:"My college"
    
// })

//restfull
app.get("/",function(req,res){
    res.redirect("/blogs")
})
app.get("/blogs",function(req,res){
    Blog.find({},function(err , blogs){
        if(err){
            console.log(err)
        }else{
            res.render("index",{blogs:blogs})
        }
    })
});
//new blog
app.get("/blogs/new",function(req, res) {
   res.render("new"); 
});
//create 
app.post("/blogs",function(req,res){
    console.log(req.body);
    
    console.log("============");
    console.log(req.body);
    
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new");
       }else{
           res.redirect("/blogs");
       }
   })
});
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.send("/blogs")
        }else{
            res.render("show",{blog:foundBlog});
        }
    })    
});
//edit
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
            
        }else{
            res.render("edit",{blog:foundBlog})
        }
    });
})
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updatedBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/"+ req.params.id)
        }
    });
});
//delete
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs")
       }else{
           res.redirect("/blogs")
       }
   });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Blog server started");
})
