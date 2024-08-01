const express = require("express");
const router = express.Router();
const path=require('path');

router.get('/',function(req, res){
    res.render('index');
})
router.get('/teste',function(req,res){
    res.render('about');
})




module.exports = router;;