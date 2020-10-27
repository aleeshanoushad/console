const express = require('express')
const mysql = require('mysql');
const shortId = require('shortid')
// const mangoose = require('mongoose')

const app = express()

// const shorturl = require('./model/shorturl')

app.use(express.urlencoded({ extended:false}))

// mangoose.connect('mongodb://localhost/urlshort',{
//     useNewUrlParser:true,useUnifiedTopology:true
// })

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"short",
    multipleStatements: true
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!"); // connected 
    //inserting into table
    var sql = "CREATE TABLE shorturls(`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, fullUrl VARCHAR(255), shortUrl VARCHAR(255))";
  });



app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('index')
})

app.post('/short',async (req,res)=>{

    var sql1 = "INSERT INTO shorturls (fullUrl, shortUrl) VALUES (?)";
    var full_url =req.body.fullurl
    var short_url =  shortId.generate();
    var values = [[full_url, short_url]];

    await  con.query(sql1,[values], (err, rows, fields) => {
    
    res.redirect('/')
    })

})

app.get('/',  (req,res)=>{
     con.query("Select * from shorturls",(err, rows, fields) => {
         if (!err){
         const url = rows
          res.render('index' ,{urldata : url}) 
         }
        else
        console.log(err);
        })
    })

    app.get('/:shortendurl',async (req,res)=>{
        const shortened = req.params.shortendurl
        con.query("Select * from shorturls where shortUrl="+shortened,(err, rows, fields) => {

            if(!err){
                if(rows == null){
                    res.send(404);
                 }
                //else{

                //     con.query("update shorturls set clicks =")
                // }
            }
        })

    })


app.listen(process.env.PORT || 5000)