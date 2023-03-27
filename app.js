const express = require('express');
var helmet = require('helmet')

const app = express();

const cors = require('cors');
//globaliser le parsing
const bodyParser = require('body-parser');
//app.use(bodyParser.json());

app.use(helmet()) 
app.use(express.json());
app.use(cors());

//header de réponses, pour que les eerveurs front et back puissent communiquer
//TO-DO : si on l'enlève ça fait quoi?
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');//, PUT, DELETE, PATCH, OPTIONS');
  next();
});

var urlencodedParser = express.urlencoded({extended: false});



function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  
  console.log('error', { error: err });
  return res.status(500).json({ error: 'il y a eu un problème. Veuillez réessayer plus tard.'});
}



const stuffRoutes = require('./routes/logique_routes');


app.use('/', urlencodedParser, stuffRoutes);
app.use(errorHandler);

module.exports = app;