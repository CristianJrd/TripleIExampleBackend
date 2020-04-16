const {PubSub, withFilter} = require('graphql-subscriptions');
const pubsub = new PubSub();
const mongoose = require('mongoose');
import {Schema} from 'mongoose';

const books = [];

const Book = mongoose.model('Book', {
  'numberVol': {
    type: String,
    required: true,
  },
  'title': {
    type: String,
    required: true,
  },
  'room': {
    type: String,
    required: true,
  },
  'bookcase': {
    type: String,
    required: true,
  },
  'position': {
    type: String,
    required: true,
  },
});

const resolvers = {
  Query: {
    getBooks(_parentValue, _params) {
      const books = Book.find().exec();
      return books;
    }
  },
  Mutation: {
    addBook(_parentValue, {numberVol, title, room, bookcase, position}) {
      books.push({numberVol, title, room, bookcase, position});

      const book = new Book({numberVol: numberVol, title: title, room: room, bookcase: bookcase, position: position});
      book.save().then(() => console.log('new book created'));

      pubsub.publish('newBookAdded', {
        newBookAdded: {numberVol, title, room, bookcase, position},
      });

      return books;
    }
  },
  Subscription: {
    newBookAdded: {
      subscribe: withFilter(
          () => pubsub.asyncIterator('newBookAdded'),
          (_params, _variables) => true
      ),
    }
  },
};

module.exports = {
  resolvers,
  Book
};
