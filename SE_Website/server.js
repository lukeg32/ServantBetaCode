const AbortController = require('abort-controller');
const express = require('express');
const {spawn} = require('child_process');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 80;
const controller = new AbortController();
const {signal} = controller;
app.use(express.json());
app.use(cors());

var pid;

// Serve public folder as homepage
app.use(express.static("/home/pi/ServantBetaCode/SE_Website/public"));

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
      signal   = signal || 'SIGKILL';
      // Try to stop python script
      try { 
            process.kill(pid, signal);
            console.log("Child Process Terminated");
       }
        catch (ex) { 
              console.log("Child Process cannot be stopped... We are Doomed");
              console.log(ex);
        }
      res.send("Child Process Terminated");
});

// Handle Post requests used to call media exhange scripts
app.post('/exchange', (req, res) => {
      // Print argument for testing
      console.log(req.body.size);
      var dataToSend;
      const args = ['exchange.py', req.body.size.toString()]
      // spawn new child process to call the python script with argument of well plate size (in this case 6 or 12)
      const python = spawn('python3', args);
      // Save pid so it can be stopped if needed
      pid = python.pid;
      // collect data from script
      python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      dataToSend = data.toString();
      console.log(dataToSend);
      });
      // in close event we are sure that stream from child process is closed
      python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      res.send(dataToSend);
      });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
