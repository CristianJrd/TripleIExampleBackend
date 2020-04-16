const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const {execute, subscribe} = require('graphql');
const {SubscriptionServer} = require('subscriptions-transport-ws');
const {createServer} = require('http');

const schema = require('./schema');

const app = express();

mongoose.connect('mongodb://cristian:1q2w3e4r5t6y@ds021289.mlab.com:21289/books_triplei');
const db = mongoose.connection;
db.on('error', ()=> console.log('Error al conectar a la BD'))
    .once('open', () => console.log('Conectado a la BD!!'));

app.use(bodyParser.json());
app.use(cors());

app.use(
    '/graphql',
    graphqlExpress({
      schema,
    })
);

app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
      subscriptionsEndpoint: 'ws://localhost:3030/graphql',
    })
);

const PORT = process.env.PORT || 3030;

const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Server now running at port ${PORT}`);
  new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
      },
      {
        server,
        path: '/graphql',
      }
  );
});