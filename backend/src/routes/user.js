const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');

//update user
router.put('/:id', async(req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin){
    if (req.body.password){
      try {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
      } catch (error) {
        return res.status(500).json(error)
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
      });
      res.status(200).json('Account has been updated..!');
    } catch (error) {
      return res.status(500).json(error)
    }
  }else {
    return res.status(403).json('You can only update your account');
  }
})

//delete user
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been delete..!');
    } catch (error) {
      return res.status(500).json(error)
    }
  } else {
    return res.status(403).json('You can only delete your account');
  }
})

//get a uuser
router.get('/:id', async (req, res) => {
  
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other} = user._doc
    res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error)
  }
})

//follow user
router.put('/:id/follow', async (req, res) => {
  //esa es una condicion que dice si el id del usuairo actual es diferente al id al usuario que se va a seguir
  //para que proceda la operación
  if(req.body.userId !== req.params.id){
    try {
      //busco el usuario que voy a seguir
      const user = await User.findById(req.params.id);
      //aqui es el id del usuario actual
      const currentUser = await User.findById(req.body.userId);
      //aqui hago una condición sabiendo si followers no contiene el id del usuario actual
      if(!user.followers.includes(req.body.userId)){
        //aqui le digo que se lo incluyamos, que ya no lo va a seguir a este usuario
        await user.updateOne({$push: {followers: req.body.userId}})
        //y aqui ya se no vera al usuairo que ya no va a seguir
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json('User has been followed');
      }else {
        res.status(403).json('You already follow this user');
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }else {
    res.status(403).json("You can't follow yourself");
  }
})

//unfollow user
router.put('/:id/unfollow', async (req, res) => {
  //esa es una condicion que dice si el id del usuairo actual es diferente al id al usuario que se va a seguir
  //para que proceda la operación
  if (req.body.userId !== req.params.id) {
    try {
      //busco el usuario que voy a seguir
      const user = await User.findById(req.params.id);
      //aqui es el id del usuario actual
      const currentUser = await User.findById(req.body.userId);
      //aqui hago una condición sabiendo si followers contiene el id del usuario actual
      if (user.followers.includes(req.body.userId)) {
        //aqui le digo que se lo quite, que ya no lo va a seguir a este usuario
        await user.updateOne({ $pull: { followers: req.body.userId } })
        //y aqui ya se no vera al usuairo que esta siguiendo
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json('User has been unfollowed');
      } else {
        res.status(403).json('You dont this user');
      }
    } catch (error) {
      res.status(500).json(error)
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
})

module.exports = router