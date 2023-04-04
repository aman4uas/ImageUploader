const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const multer = require('multer')
const path = require("path")
const ejs = require("ejs")
const mongoose = require("mongoose")


//Setting up view Engine Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }))


//Creating mongoose schema
mongoose.connect("mongodb+srv://amanhacks4u:h4MEjCHDWw9UtZam@cluster0.sg6mffa.mongodb.net/imageUploaderDB").then(()=>{console.log("Connected to DB successfully !!")})
const fileSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: [true, "Uploaded file must have a name"],
    },
});
const File = mongoose.model("File", fileSchema);



//Configuring Multer
/*const upload = multer({ dest: "public/files" });*/
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/files")
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `admin-${file.fieldname}-${Math.round(Math.random() * 1E9)}-${Date.now()}.${ext}`);
    },
})



//Multer Filter if needed
/*
const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
        cb(null, true);
    } else {
        cb(new Error("Not an Image File!!"), false);
    }
};
*/

//Calling multer function
const upload = multer({
    storage: multerStorage
    // fileFilter: multerFilter
})

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/", upload.single("image"), (req, res) => {
    // console.log(req.file)
    // console.log("\nNew    Line\n")
    // console.log(req.body)
    // res.send(`<img src="files/${req.file.filename}" alt="">`)

    const img_file = new File({ name: req.file.filename })
    img_file.save().then(() => console.log('Saved Image name to database'))
    res.redirect("/photos")
    
})
app.get("/photos", (req, res)=>{
    File.find({}).then((array_pic)=>{
        res.render("photos",{array_pic: array_pic})
    }).catch((err)=>{
        res.send(err)
    })
    //res.render("photos", {array_pic : array_pic})
})



app.listen(3000, () => {
    console.log("Port working at 3000")
})