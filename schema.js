/* eslint-disable max-len */
const {makeExecutableSchema} = require('graphql-tools');
const {resolvers} = require('./resolvers');

const typeDefs = `
  type Book {
    _id: ID! @unique
    numberVol: String!
    title: String!
    room: String!
    bookcase: String!
    position: String!
  }

  type Query {
    getBooks: [Book]
  }

  type Mutation {
    addBook(numberVol: String!, title: String!, room: String!, bookcase: String!, position: String!): [Book]
  }

  type Subscription {
    newBookAdded: Book
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = makeExecutableSchema({typeDefs, resolvers});
