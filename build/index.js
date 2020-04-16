'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

var _require = require('apollo-server-express'),
    graphqlExpress = _require.graphqlExpress,
    graphiqlExpress = _require.graphiqlExpress;

var _require2 = require('graphql'),
    execute = _require2.execute,
    subscribe = _require2.subscribe;

var _require3 = require('subscriptions-transport-ws'),
    SubscriptionServer = _require3.SubscriptionServer;

var _require4 = require('http'),
    createServer = _require4.createServer;

var schema = require('./schema');

var app = express();

mongoose.connect('mongodb://cristian:1q2w3e4r5t6y@ds021289.mlab.com:21289/books_triplei');
var db = mongoose.connection;
db.on('error', function () {
  return console.log('Error al conectar a la BD');
}).once('open', function () {
  return console.log('Conectado a la BD!!');
});

app.use(bodyParser.json());
app.use(cors());

app.use('/graphql', graphqlExpress({
  schema: schema
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:3030/graphql'
}));

var PORT = process.env.PORT || 3030;

var server = createServer(app);
server.listen(PORT, function () {
  console.log('Server now running at port ' + PORT);
  new SubscriptionServer({
    execute: execute,
    subscribe: subscribe,
    schema: schema
  }, {
    server: server,
    path: '/graphql'
  });
});