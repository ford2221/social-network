const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User')

//create post
router.post('/', async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save()
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error)
  }
})

//update post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if(post.userId === req.body.userId){
      await post.updateOne({$set: req.body});
      res.status(200).json('desc has been updated');
    }else {
      res.status(403).json('You can update only your post')
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

//delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json('desc has been deleted');
    } else {
      res.status(403).json('You can delete only your post')
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

//like a post and dislike
router.put('/:id/like', async (req, res) => {
  try {
    //buscando el post por su id
    const post = await Post.findById(req.params.id)
    //si el post no tiene el like del usuario actual, lo puedo dar like
    if(!post.likes.includes(req.body.userId)){
      await post.updateOne({$push: {likes: req.body.userId}})
      res.status(200).json('The post has been liked')
    }else {
      //aqui lo esta quitando el like
      await post.updateOne({$pull: {likes: req.body.userId}})
      res.status(200).json('The post has been disliked')
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

//get a post
router.get('/:id', async (req, res) => {

  try {
    const post = await Post.findById(req.params.id);
    const {updatedAt, ...other } = post._doc
    res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error)
  }
})
//get timeline posts
router.get('/timeline/all', async (req, res) =>{
  try {
    //buscando el usuario actual
    const currentUser = await User.findById(req.body.userId)
    //buscando los psot del usuairio actual
    const userPosts = await Post.find({userId: currentUser._id})
    //mapeando los posts de los amigos
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({userId: friendId})
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error)
  }
})


module.exports = router