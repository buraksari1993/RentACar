var mongoose=require("mongoose");

var arabaSchema=new mongoose.Schema({
    marka:String,
    model:String,
    yakıt:String,
    resim:String,
});

module.exports=mongoose.model("Car",arabaSchema);