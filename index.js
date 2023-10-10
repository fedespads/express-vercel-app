import express from "express";
const app = express();
const port = 9000;

app.use("/",(req,res)=>{
  res.json({message: "ha funzionatoo"});
})

app.listen(9000, ()=>{
  console.log('start server in '+port)
})