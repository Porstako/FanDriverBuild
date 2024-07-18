//Autor: Piotr Gliński 

// Plik uruchamiający serwer node.js
// serwer domyślnie działa na poniższych ustawieniach:
// ip localhost lub SterownikAS
// port 8080

// kod posiada obsługę plików html, css, js, tff oraz svg
// 

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const { exec } = require('child_process');
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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.use((req, res, next) => {
  if (req.path.endsWith('.html')) { // Dla plików HTML
      res.setHeader('Content-Type', 'text/html');
  }
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/update', (req, res) => {
  exec('sh /home/pi/FanDriver/update_script.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Update Failed');
    } else {
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res.status(200).send('Update Successful');
    }
  });
});

app.get('/stats', (req, res) => {
  res.sendFile(path.join('/home/pi/FanDriver/rpi', 'stats.json'));
});

app.post('/connect', (req, res) => {
  const { ssid, password } = req.body;
  const script = `/home/pi/FanDriver/connect_wifi.sh "${ssid}" "${password}"`;
  
  exec(script, (error, stdout, stderr) => {
      if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).send("Błąd podczas łączenia z siecią Wi-Fi.");
      }
      res.send("Pomyślnie połączono z siecią Wi-Fi.");
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  io.emit('config', config);

  socket.on('pythonData', (data) => {
    io.emit('pythonData', data);
  });

  socket.on('config', (data) => {
    io.emit('config', data);
    config = data;
  });

  socket.on('clientData', (data) => {
    io.emit('clientData', data);
  });
});

