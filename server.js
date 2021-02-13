'use strict';
const config = require('./config');
const fbeamer = require('./fbeamer/index');
const express = require('express');
const bp = require('body-parser');

const mapIntent = require('./map_intent')

const FB = new fbeamer(config.FB);
const server = express();
const PORT = process.env.PORT;

const launch_server = () =>{
  server.get('/', (req, res) => FB.registerHook(req, res));

  server.post('/', bp.json ({
    verify: FB.verifySignature.call(FB)
  }));

  server.post('/', (req, res, data) => FB.incoming(req, res, async data => {
    data = FB.messageHandler(data);
    if(data!=undefined){
      mapIntent(data, FB) 
    }
    
    }));
  
  server.listen(PORT, () => console.log(`The bot server is running on port ${PORT}`));
}

module.exports = launch_server;