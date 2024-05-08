const express  = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

const PORT  = process.env.PORT || 8080

//schéma
const travelPlan  = mongoose.Schema({
    name : String,
    location : String,
    date : String,
    time : String,
},{
    timestamps : true
})

const userModel  =mongoose.model("user",travelPlan)


//read
//http://localhost:8080/
app.get("/",async(req,res)=>{
    const data = await userModel.find({})

    res.json({success : true , data : data})
})


//vytváranie a ukladanie dát v mongoDB
//http://localhost:8080/create
/*
{
    name,
    location,
    date,
    time,
}
*/
/*
app.post("/createPlan", async (req, res) => {
    try {
        console.log(req.body);
        const data = new userModel(req.body);
        await data.save();
        res.send({ success: true, message: "data saved successfully", data : data});
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});*/

app.post("/createPlan", async (req, res) => {
    try {
        // Tento kód sa pokúsi vykonať
        console.log(req.body);
        const data = new userModel(req.body);

        // Kontrola, či sú všetky polia vyplnené
        if (!data.name || !data.location || !data.date || !data.time) {
            throw new Error("All fields must be filled out");
        }

        await data.save();
        res.send({ success: true, message: "data saved successfully", data : data});
    } catch (err) {
        // Ak nastane chyba v bloku try, tento kód sa vykoná
        console.error(err);  // Pridané logovanie chýb
        res.status(500).send({ success: false, message: err.message });
    }
});


//update dát
//http://localhost:8080/update
/*
{
    id : ""
    name : ""
    location : ""
    date : ""
    time : ""
}
*/
app.put("/update",async(req,res)=>{
    console.log(req.body)
    const { _id,...rest} = req.body

    console.log(rest)
    const data = await userModel.updateOne({ _id : _id},rest)
    res.send({success : true, message : "data update successfully", data : data})
})

//delete
//http://localhost:8080/delete/id
app.delete("/delete/:id",async(req,res)=>{
    const _id = req.params.id
    console.log(_id)
    const data = await userModel.deleteOne({_id : _id})
    res.send({success : true, message : "data delete successfully", data : data})
})




mongoose.connect("mongodb://localhost:27017/app")
.then(()=>{
    console.log("connected to DB")
    app.listen(PORT,()=>console.log("Server is running"))
})
.catch((err)=>console.log(err))
