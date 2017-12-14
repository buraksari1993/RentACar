var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    User = require("./models/User"),
    Car = require("./models/Car"),
    passport = require('passport'),
    passportLocal = require('passport-local');


mongoose.connect("mongodb://localhost/RentACar");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "bu bi session uygulaması",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Araba.create({
//     marka:"bmw",
//     model:"m3",
//     yakıt:"benzin",
//     resim:"https://cdn.pixabay.com/photo/2015/09/02/12/25/bmw-918407__340.jpg"
// },function(err,arabaDB){
//     if(err){
//         console.log("wrong");
//     }else{
//         console.log("yeni araba ekleme oldu");
//         console.log(arabaDB);
//     }
// });

// Araba.find({},function(err,arabaDB){
//     if(err){
//         console.log("wrong");
//     }else{
//         console.log("arabalar");
//         console.log(arabaDB);
//     }
// });
//*******GET ROUTE
var Araba = mongoose.model("Car");
app.get("/", function (req, res) {
    //arabaları database al
    Araba.find({}, function (err, arabalarDB) {
        if (err) {
            console.log(err);
        } else {
            res.render("Anasayfa", { Arabalar: arabalarDB });
        }
    });
});
app.get("/Kaydol", function (req, res) {
    res.render("Kaydol");
});
app.post("/Kaydol", function (req, res) {
    var yeniKullanici = new User({name: req.body.name,surname: req.body.surname,username: req.body.username});
    User.register(yeniKullanici, req.body.password, function (err, kullanici) {
        if (err) {
            console.log("hata ne"+err);
            return res.render("Kaydol");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/gizli");
        });
    });
});
app.get("/gizli", function (req, res) {
    res.render("gizli");
});
//*******CREATE ROUTE
app.post("/Arabalar", function (req, res) {
    var marka = req.body.marka;
    var model = req.body.model;
    var yakıt = req.body.yakıt;
    var resim = req.body.resim;
    var yeniAraba = { marka: marka, model: model, yakıt: yakıt, resim: resim };
    //yeni araba oluştur ve db kaydet
    Araba.create(yeniAraba, function (err, yeniDB) {
        if (err) {
            console.log(err);
        } else {
            //res.render("Anasayfa",{Arabalar:arabalarDB});
            res.redirect("/");
        }
    });

});
//*******NEW ROUTE
app.get("/Arabalar/ArabaEkle", function (req, res) {
    res.render("ArabaEkle");
});

app.get("/Arabalar/:id", function (req, res) {
    Araba.findById(req.params.id, function (err, bulunanAraba) {
        if (err) {
            console.log(err);
        } else {
            res.render("Detay", { araba: bulunanAraba });
        }
    });
});

var server = app.listen(3000, function () {
    console.log("Sunucu Portu : %d", server.address().port);
});