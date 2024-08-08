const express = require("express");
const router = express.Router(); //Trabalha com rotas
const path=require('path');

router.get('/',function(req, res){
    res.render('index');
})
router.get('/about',function(req,res){
    res.render('about');
   // res.sendFile(path.join(__dirname+'/../about.html'))
})

module.exports = router;;