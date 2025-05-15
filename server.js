'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
          console.log('Tests are not valid:');
          console.error(e);
      }
    }, 1500);
  }
});

const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

function listRoutes(app) {
  console.log('\nRegistered routes:');
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      // Direct routes
      const { path, methods } = middleware.route;
      console.log(`${Object.keys(methods).join(', ').toUpperCase()} ${path}`);
    } else if (middleware.name === 'router') {
      // Routes from router (like apiRoutes)
      middleware.handle.stack.forEach(handler => {
        const route = handler.route;
        if (route) {
          const { path, methods } = route;
          console.log(`${Object.keys(methods).join(', ').toUpperCase()} /api${path}`);
        }
      });
    }
  });
}

listRoutes(app);

module.exports = app; //for unit/functional testing
