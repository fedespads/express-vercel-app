import { createServer } from "http";
import puppeteer from 'puppeteer-core';

let page;
async function clicca(soggetto, numero) {
  await page.waitForSelector(soggetto);

  if (typeof numero === "undefined") {
    await page.click(soggetto);
  } else {
    const elements = await page.$$(soggetto);
    if (elements.length > numero) {
      await elements[numero].click();
    } else {
      console.error(`Elemento con indice ${numero} non trovato.`);
    }
  }
}
async function innerHTML(className, index) {
  await page.waitForSelector(className);
  const elements = await page.$$(className);
  if (typeof index === "undefined") {
    const firstElement = elements[0];
    if (firstElement) {
      const innerHTML = await firstElement.evaluate(
        (element) => element.innerHTML
      );
      return innerHTML;
    } else {
      return null;
    }
  } else {
    if (index >= 0 && index < elements.length) {
      const element = elements[index];
      const innerHTML = await element.evaluate((element) => element.innerHTML);
      return innerHTML;
    } else {
      return null;
    }
  }
}

const server = createServer(async (req, res) => {
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

  if (req.url === "/film") {
    // Gestisci la richiesta principale
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "ha funzionato" }));
    } else if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        try {

          




          exports.handler = async (event) => {
            
            const data = JSON.parse(body);
            let browser;
            try {
              browser = await puppeteer.launch({
                executablePath: '/path/to/chromium' // Specifica il percorso a Chromium se necessario
              });


              let pages = await browser.pages();
          page = pages[0];
          await page.goto('https://www.ucicinemas.it/cinema/emilia-romagna/ferrara/uci-cinemas-ferrara/')
          await clicca('#onetrust-reject-all-handler');
          const moviesData = await page.evaluate(() => {
            const movies = [];
            const showDivs = document.querySelectorAll('.showtimes__show');
            showDivs.forEach((showDiv) => {
              let movieName = showDiv.querySelector('.movie-name').textContent;
              movieName = movieName.replace(/\n/g, '');
              const showtimes = [];
              const timeListItems = showDiv.querySelectorAll('ul li');
              timeListItems.forEach((timeListItem) => {
                showtimes.push(timeListItem.textContent);
              });
              movies.push([movieName, showtimes]);
            });
            return movies;
          });


              await browser.close();
          
              return {
                statusCode: 200,
                body: JSON.stringify(moviesData),
              };
            } catch (error) {
              return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Errore nell\'uso di Puppeteer' }),
              };
            } finally {
              if (browser) {
                await browser.close();
              }
            }
          };
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(moviesData));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Errore nell'uso di Puppeteer o nel parsing del JSON" }));
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
