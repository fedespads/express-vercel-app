const express = require("express");
const cors = require("cors"); // Importa il pacchetto CORS
const app = express();
const port = 9000;

app.use(cors()); // Abilita CORS per tutte le route

app.use("/", (req, res) => {
  res.json({ message: "ha funzionato" });
});

app.listen(9000, () => {
  console.log('start server in ' + port)
});