const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post Added Successfully'
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "123vsdvsd",
      title: "First server side post",
      content: "This is comming from the server",
    },
    {
      id: "asdas1234",
      title: "Second server side post",
      content: "This is comming from the server2!",
    },
  ];
  res.status(200).json({
    message: "Posts fetched succesfully",
    posts: posts,
  });
});

module.exports = app;
