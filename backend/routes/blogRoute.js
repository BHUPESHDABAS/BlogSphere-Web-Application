import express from "express";
import Blog from "../models/Blog.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

//Create Blog
router.post("/", authMiddleware, async (req,res)=>{
    try {
        const {title, content} = req.body;
        const newBlog = new Blog({title, content, author: req.user.id});
        await newBlog.save();
        res.status(201).json({newBlog, message:"Blog created successfully"});
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while posting Blog", error });
    }
})

//Get all Blogs
router.get("/", async (req,res) =>{
    try {
        const blogs = await Blog.find().populate("author", "name email");
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Server Error while fetching Blogs" });
    }
})

//Get Blog by :id
router.get("/:id", async (req,res) =>{
    try {
        const blog = await Blog.findById(req.params.id).populate("author", "name email");
        if(!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Server Error while fetching Blog" });
    }
})

//Update Blog 
router.put("/:id", authMiddleware, async(req,res) =>{
    try {
        const {title, content} = req.body;
        const blog = await Blog.findById(req.params.id);

        if(!blog) return res.status(404).json({ message: "Blog not found" });
        if(blog.author.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        blog.title = title;
        blog.content = content;
        await blog.save();

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Server Error while Updating Blog" });
    }
})

//Delete Blog
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: "Blog not found" });
      if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
  
      await blog.deleteOne();
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error while Deleting Blog" });
    }
});


export default router;