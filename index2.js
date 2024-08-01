const express = require("express"); //ok
const path = require('path');    //ok
const router=express.Router();
const routesAdmin = require('./routes/routesAdmin');  //ok
const{engine} = require("express-handlebars");

const app = express();

app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions:{
            allowProtoMethodsByDefault: true,
            allowProtoMethodsByDefault: true,
    },
}))

app.set('view engine', 'handlebars');

app.use('/',routesAdmin)

router.get('/', function(req, res){
    res.render('index');
})
router.get('/teste', function(req, res){
    res.sendFile(path.join(__dirname+ 'about'));
})

app.listen(process.env.port||2000);
console.log("Servidor Rodando");