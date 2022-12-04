const e = require("express");
const express = require("express");
const math=require("mathjs");
const app = express();


const { initializeApp , cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
var serviceAccount = require("./key.json");
initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine","ejs");
app.use(express.static('public'));

app.get("/",(req,res)=>{
    res.send("Hello World!!");
});

app.get("/login",(req,res)=>{
    res.render("login")  
});
app.get("/loginsubmit",(req,res)=>{
    const email=req.query.email;
    const password=req.query.password;
    const name = req.query.name;
    db.collection("clientDetails")
    .where("Email","==",email)
    .where("Password","==",password)
    .where("Name", "==", name)
    .get()
    .then((docs) => {
        if(docs.size > 0){
            res.render("home_code");
        }
        
        else{
            res.render('signup');
        }
    });
});

app.get("/signup",(req,res)=>{
    res.render('signup');
});
app.get("/signupsubmit",(req,res)=>{
    const name_=req.query.name;
    const email_=req.query.email;
    const password_=req.query.password;
    db.collection("clientDetails").add({
        Name : name_,
        Email : email_,
        Password: password_,
    }).then(()=>{
        res.render("login") 
    });
});

app.get("/home",(req,res)=>{
    res.render("home_code");
})
app.get("/Thankyou", (req, res)=>{
    res.render("thankyou");
});
const arr=[];
const costs=[];
var amount=0;
app.get("/addedToCart",(req,res)=>{
    const val=req.query.item;
    var c=req.query.cost;
    costs.push(c);
    c=math.evaluate(c.slice(0,c.length-2));
    amount=amount+c;
    arr.push(val);
    res.render("home_code");
});

app.get("/cart",(req,res)=>{
    if(typeof(arr) != "undefined"){
        db.collection("Cart").add({
            Cart : arr,
            Costs : costs,
            TotalCost : amount,
        }).then(()=>{
            res.render("cart",{booksData : arr, amount : amount, costs : costs});
        });
    }
});
app.listen(4000, function () {  
console.log('Example app listening on port 4000!')  
});