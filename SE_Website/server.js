const AbortController = require('abort-controller');
const express = require('express');
const {spawn} = require('child_process');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 80;
const controller = new AbortController();
const {signal} = controller;
app.use(cors());

// Serve public folder as homepage
app.use(express.static("/home/pi/ServantBetaCode/SE_Website/public"));

// app.get('/', (req, res) => {
 
//       var options = {
//             root: path.join(__dirname)
//       };
//       res.sendFile('index.html', options);
//       res.sendFile('HomeStylesheet.css', options);
 
// })

app.get('/pythonhello', (req, res) => {

      var dataToSend;
      // spawn new child process to call the python script
      const python = spawn('python3', ['script1.py']);
      // collect data from script
      python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      dataToSend = data.toString();
      });
      // in close event we are sure that stream from child process is closed
      python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      res.send(dataToSend);
      });
});


app.get('/pythondispense', (req, res) => {

      var dataToSend;
      // spawn new child process to call the python script
      const python = spawn('python3', ['script2.py']);
      // collect data from script
      python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      dataToSend = data.toString();
      });
      // in close event we are sure that stream from child process is closed
      python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      res.send(dataToSend);
      });
});

// Get Request to *hopefully* abort the currently running child process
app.get('/abort', (req, res) => {

      controller.abort();
      res.send("Child Process Terminated");
});

app.listen(port, () => console.log(`Example app listening on port 
${port}!`))
