'use strict'

const crypto = require('crypto');
const request = require('request'); 
const apiVersion = 'v6.0';


class FBeamer{
  constructor({pageAccessToken , VerifyToken, appSecret}){
  try{
    this.pageAccessToken = pageAccessToken;
    this.VerifyToken = VerifyToken;
    this.appSecret = appSecret;
  }
  catch{
    console.log("We don't have the two Tokens");
  }
  
  }
  registerHook(req, res) {
    const params = req.query;
    const mode = params['hub.mode'], token = params['hub.verify_token'], challenge = params['hub.challenge'];
    try {
      if (mode === 'subscribe' && token === this.VerifyToken) {
      console.log("webhook is registered");
      return res.send(challenge);
    
    } else {
      console.log("Could not register webhook!");
      return res.sendStatus(200);
    }
    } catch(e) {
      console.log(e);
    } 
  }

  verifySignature(req, res, buf){
    return (req, res, buf) =>{
      if(req.method == 'POST'){
        try{
          let tempo_hash = crypto.createHmac('sha1', process.env.appSecret).update(buf, 'utf-8');
          let hash = 'sha1=' + tempo_hash.digest('hex');
          if(hash !=  req.headers['x-hub-signature']){
            throw Error('hash and x hub signature are not the same')
          }
          
        }
        catch (e) {
          console.log(e);
        }
      }
    }
  }

  messageHandler(obj){
    let sender = obj.sender.id;
    let message = obj.message; 
    let nlp = message.nlp
    let entities = {}
    let intent 
    if(nlp.intents.length>0 && nlp.intents[0].confidence>0.8){
      Object.values(nlp.entities).forEach(x=>{entities[x[0].name]=x[0].value})
      intent = nlp.intents[0].name
    }
    

    if (message.text){
      let obj = { sender ,
            type: 'text',
            content : message.text,
            intent,
            entities

      }
      return obj; 
    }
  }
 
  incoming(req, res, cb) { 
    res.sendStatus(200);
    if(req.body.object == 'page' && req.body.object){
      let data = req.body;
      data.entry.forEach(x =>{
        x['messaging'].forEach(x =>{
          cb(x)
        })
      })
    }
  }


  sendMessage(payload){
    return new Promise((resolve, reject) => { request ({
      
      uri: 'https://graph.facebook.com/v9.0/me/messages',
      qs :{
        access_token : this.pageAccessToken
      },
      method: 'POST',
      json: payload
      }, (error , response , body) => {
        if(!error && response.statusCode === 200){
           resolve ({
            mid: body.message_id
            });
        }else {
      
          reject(error);
          }
      }); 
    });
  }

  txt(id, text, messaging_type = 'RESPONSE'){
    let obj = { messaging_type , 
                recipient:{ id },
                message: {text} }
    return this.sendMessage(obj);
    }

  img(id, img, messaging_type = 'RESPONSE'){
    let obj = {
      recipient:{id},
      message:{
        attachment:{
              type:"image", 
              payload:{url:img}
        }
      }
    }
    return this.sendMessage(obj);
  }

}




module.exports = FBeamer;