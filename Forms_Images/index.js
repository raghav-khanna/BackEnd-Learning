const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const app = express();

cloudinary.config({
  // cloud_name: process.env.CLOUD_NAME
  //After uploading this to git, the key will be changed so please check there before running this in future
  cloud_name: "ragahvcloudinary",
  api_key: "827475268787216",
  api_secret: "IBrgGXrpleoF8lIowfqk-BgK8t8",
});

//View Engine Middleware
app.set("view engine", "ejs");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //extended:true makes it possible for a nested object (Object in Object)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/myget", (req, res) => {
  console.log(req.body);

  // res.send(req.body);
  res.send(req.query);
});

app.post("/mypost", async (req, res) => {
  console.log(req.body);
  console.log(req.files); //This will give undefined if enctype="multipart/form-data" is not there in <form>

  // let file = req.files.sampleFile;

  // result = await cloudinary.uploader.upload(file.tempFilePath, {
  //   folder: "Users",
  // });

  // console.log(`The Result is -> ${result}`);

  //*******Handling multiple files******** */

  let imgArr = [];

  for (i = 0; i < req.files.sampleFile.length; i++) {
    let file = req.files.sampleFile[i];
    let result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "Users",
    });
    imgArr.push(result);
  }

  details = {
    email: req.body.email,
    password: req.body.password,
    imgArr,
  };

  console.log(details);

  res.send(details);
});

//For rendering forms
app.get("/mygetform", (req, res) => {
  res.render("getform"); //This is the name of the ejs file
});

app.get("/mypostform", (req, res) => {
  res.render("postform"); //This is the name of the ejs file
});

app.listen(4000, () => console.log(`Server is running at port 4000...`));
