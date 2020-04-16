'use strict';

/* eslint-disable max-len */
var _require = require('graphql-tools'),
    makeExecutableSchema = _require.makeExecutableSchema;

var _require2 = require('./resolvers'),
    resolvers = _require2.resolvers;

var typeDefs = '\n  type Book {\n    _id: ID! @unique\n    numberVol: Int!\n    title: String!\n    room: String!\n    bookcase: String!\n    position: Int!\n  }\n\n  type Query {\n    getBooks: [Book]\n  }\n\n  type Mutation {\n    addBook(_id: ID!, numberVol: Int!, title: String!, room: String!, bookcase: String!, position: Int!): [Book]\n  }\n\n  type Subscription {\n    newBookAdded: Book\n  }\n\n  schema {\n    query: Query\n    mutation: Mutation\n    subscription: Subscription\n  }\n';

module.exports = makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });