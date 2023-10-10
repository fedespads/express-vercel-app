import { createServer } from "http";

const server = createServer((req, res) => {
  // Imposta le intestazioni CORS per consentire tutte le origini (questo è solo per scopi di esempio,
  // è possibile configurarlo in modo più restrittivo).
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Risposta preflight per richieste CORS con metodo OPTIONS
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/") {
    // Gestisci la richiesta principale
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "ha funzionato" }));
    } else if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const data = JSON.parse(body);
          // Fai qualcosa con i dati ricevuti dalla richiesta POST
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({"message": `i${data}i`}));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Errore nel parsing del JSON" }));
        }
      });
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Metodo non consentito" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Pagina non trovata" }));
  }
});

const port = 9000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
