const movieList = require('./movieSchema')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')

const PORT = 1234;
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/attach', express.static('attach'));

// Building Connection
mongoose.connect('mongodb://localhost:27017/Movie-Wishlist')
.then(()=>{
    console.log("DB Connected")
}).catch(err=>{console.log(err)});

// Defining Multer
let storage= multer.diskStorage({
    destination:function(req,file,cb){
    cb(null,'attach')
    },

    filename:function(req,file,cb){
        cb(null,file.fieldname+ '-'+Date.now()+'.'+file.originalname.split('.')
		[file.originalname.split('.').length-1])
       }


});
let upload = multer({storage:storage}).single('movImg');

//Add movie on wishlist
app.post("/addMovie", async(req,res)=>{
    try{
        upload(req,res,async(err)=>{
            if(err){
                res.status(400).json({"error":"Error in Image Uploading"})
            }
            else{
                const{title,description,reYear,gnre} = req.body;

                let send = await movieList.create({
                    "title":title,
                    "description":description,
                    "reYear":reYear,
                    "gnre":gnre,
                    "movImg":req.file.filename,
                })
                if(send){
                    res.status(200).json({"msg":"Added on Wishlist"})
                    }
                    else{
                    res.status(400).json({"error":"Error in DB query"})
                    }
            }
        })
    }
    catch{
        res.status(500).json({"err":"Internal server error"})
    }
})

//Fetching all movies on cards
app.get("/fetchMovie",async(req,res)=>{

    let data = await movieList.find();
    res.send(data);
})

//Delete movie from wishlist
app.delete("/deleteMovie/:id", async (req, res) => {
    try {
      const movieId = req.params.id;
      const deletedMovie = await movieList.findByIdAndDelete(movieId);
      if (deletedMovie) {
        res.status(200).json({ "msg": "Movie deleted successfully" });
      } else {
        res.status(404).json({ "error": "Movie not found" });
      }
    } catch (err) {
      res.status(500).json({ "error": err.message });
    }
  });

//Fetch particuler movie data
app.get("/fetchMovieData/:id",async(req,res)=>{
    try {
        const movieId = req.params.id;
        const movie = await movieList.findById(movieId);
        if (movie) {
          res.status(200).json(movie);
        } else {
          res.status(404).json({ "error": "Movie not found" });
        }
      } catch (err) {
        res.status(500).json({ "error": err.message });
      }
})



// Update the movie Details
app.put("/updateMovieDetail/:id", async (req, res) => {
    try {
      const movieId = req.params.id;
      const { title, description, reYear } = req.body;
  
      const updatedMovie = await movieList.findByIdAndUpdate(
        movieId,
        { title, description, reYear },
        { new: true }
      );
  
      if (updatedMovie) {
        res.status(200).json({ msg: "Movie details updated successfully" });
      } else {
        res.status(404).json({ error: "Movie not found" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
app.listen(PORT, ()=> console.log(`Connection build on port ${PORT}`))
