const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
// user: KushKing
// pass: OnlyEddies
const MONGODB_URI = "mongodb+srv://KushKing:OnlyEddies@cluster0.1bxj4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const app = express()
const PORT = process.env.PORT || 8080

mongoose.connect(MONGODB_URI || 'mongodb://localhost/my-app',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.on('connected',()=>{console.log("connected")})

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: String,
    src:   String,
    link:  String,
    text:  String,
    date: {
        type: String,
        default: Date.now()
    }
})

// Model

const Post = mongoose.model('Post', postSchema)

// saving data

const dummyData = {
    title: "Jimmy Nooch",
    src: "https://upload.wikimedia.org/wikipedia/en/thumb/7/76/Jimmy_Neutron_Boy_Genius_film.jpg/220px-Jimmy_Neutron_Boy_Genius_film.jpg",
    link: "https://jimmyneutron.fandom.com/wiki/Jimmy_Neutron",
    text: "Jimmy Neutron is a show that was on Nickolodeon."
}

// .save()
const newPost = new Post(dummyData)

// newPost.save((e)=>{
//     if(e){ 
//         console.log("error saving dummyData")
//     } else {
//         console.log("dummy data saved")
//     }
// })
app.use(express.json())
app.use(express.urlencoded({extended: false})) // if obj is very nested, set to true
//HTTP req logger
app.use(morgan('tiny'));



app.get("/api",(req,res)=>  {
  Post.find({})
  .then((data) =>  {res.json(data)})
  .catch((e=>{console.log(e)}))

})

app.post("/api/save",(req,res)=>{
    console.log("Body: ", req.body)
    res.json({msg: "data received"})
    const newPost = new Post(req.body)
    newPost.save((error)=>{
        if(error){
            console.log("error saving to api")
        } else{
            console.log("saved to api")
        }
    })
})

app.delete("/api/del",(req,res)=>{
    console.log("received del req")
    console.log(req.body)
    Post.deleteOne({date:req.body.date},(err)=>{
        if(err){
            console.log("del failed")
        }else{
            console.log("deleted one")
        }
    })
})

app.listen(PORT,console.log(`Server is staring at ${PORT}`))