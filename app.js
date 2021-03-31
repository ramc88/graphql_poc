const fs = require('fs');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const mongoose = require('mongoose');

const userSchema = require('./models/user');

const app = express();

const conf = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const corsOptions = {
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'access_token', 'ACCESS_TOKEN'],
    exposedHeaders: ['Content-Type', 'Authorization', 'access_token', 'ACCESS_TOKEN'],
  };

app.use(cors(corsOptions));
app.use(compress());
app.use(bodyParser.json({
  limit: '50mb',
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false,
}));

mongoose.connect(conf.mongodb);

mongoose.connection.on("error", () => {
    console.log('Error connecting with mongodb');
})

mongoose.connection.on("connected", () => {
    console.log('Connection started');
})

const graphqlSchema = require("./schemas/index");
const { Mongoose } = require('mongoose');
app.use(
    "/graphql",
    graphqlHTTP((request) => {
        return {
            graphiql: true,
            schema: graphqlSchema
        }
    })
)

fs.readdirSync('./routes/').forEach((file) => {
    if (file != '.DS_Store') {
      const routeName = file.split('.')[0];
      const route = `./routes/${file}`;
      console.log(file);
      app.use(`/${routeName}`, require(route));
    }
  });

app.listen(3000, () => {
    console.log('Listening on port 3000');
}); 