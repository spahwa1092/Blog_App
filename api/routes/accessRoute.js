const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");


router.put('/:id',async(req,res)=>{
    
    const postId = req.params.id;
    try{
        
        const updatedPost = await Post.findOneAndUpdate(
            {_id:postId},
            {$set:{admin:true}},
            {new:true},
        );

        if (updatedPost) {
            console.log("Hanji de diya access");
            res.json({
              success: true,
              message: "Post updated successfully",
              updatedPost: updatedPost
            });
          } else {
            console.log("Hanji hogya fail access");
            res.status(404).json({
              success: false,
              message: "Post not found"
            });
          }
      

    }catch(error){
        res.status(404).send({
            success:false,
            messsgae:"Hanjii fail hogye ap"
        })
        console.log("Hanji hogya fail access")

    }
})


router.get('/',async(req,res)=>{

    const {admin} = req.query;
    try{

        const posts = await Post.find({admin:admin});
        res.status(200).json(posts);
        

    }catch(error){
        console.log(error);
    }
})

router.delete('/:id',async(req,res)=>{

    const postId = req.params.id;
    try{
        const post = await Post.findByIdAndDelete({_id:postId});
        if(post){
            res.status(200).send({
                success:true,
                message:"done",
            })
            console.log("done");
        }else{
            res.status(404).send({
                success:true,
                message:"done",
            })
            console.log("post not deleted")
        }

    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = router;