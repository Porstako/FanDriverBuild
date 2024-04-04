//Autor: Piotr Gliński 

// Plik uruchamiający serwer node.js
// serwer domyślnie działa na poniższych ustawieniach:
// ip localhost raspberry
// port 8080

// kod posiada obsługę plików html, css, js, tff oraz svg
// 

var http = require('http').createServer(handler);
var fs = require('fs');
var path = require('path');
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


let config = {
  type: 'config',
  offgridInverter:false,
  PWM1Min:200,
  PWM1Max:300,
  PWM2Min:300,
  PWM2Max:550,
  sweptDiameter:630,
  powerCoefficient: 0.4
};

http.listen(8080); //port serwera

function handler (req, res) { //utwórz serwer
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  let filePath = path.join(__dirname, 'public', req.url);
  if (req.url === '/') {
    filePath = path.join(__dirname, 'public', 'index.html');
  }
  const extname = String(path.extname(filePath)).toLowerCase();
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.ttf':
      contentType = 'font/ttf';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;

/*
Przykład dodania kolejnego rozszerzenia pliku, wystarczy skopiować poniższy kod i podmienić co trzeba
    case '.rozszerzeniePliku':
      contentType = 'typ MIME'
      break;


      Szczegółowy opis: https://pl.wikipedia.org/wiki/Typ_MIME
*/
  }

  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': contentType}); //odczyt pliku
    res.write(data); //Wyświetlenie danych z pliku
    return res.end();
  });

  
}

// Połączenie WebSocket
io.sockets.on('connection', function (socket) {
  io.emit('config', config);


  //Dane wyslane z clienta pythona
  socket.on('pythonData', (data) => {
    if(data.type !== undefined) {
      io.emit('pythonData', data);
    }
  });

  //Dane config
  socket.on('config', (data) =>{
    if(data.type !== undefined) {
      io.emit('config', data);
      config=data;
    }
  })

  //Dane wyslane z clienta przeglądarki
  socket.on('clientData', (data) =>{
    if(data.type !== undefined) {
      io.emit('clientData', data);
    }
  })
});
