'use strict';
const express = require('express');
const server = express();
const PORT = process.env.PORT || 3000;

const launch_server = () =>{

  server.get('/', (req, res) => res.send("hello!!"));
  
  server.listen(PORT, () => console.log(`The bot server is running on port ${PORT}`));
}

module.exports = launch_server;


