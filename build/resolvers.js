'use strict';

var _mongoose = require('mongoose');

var _require = require('graphql-subscriptions'),
    PubSub = _require.PubSub,
    withFilter = _require.withFilter;

var pubsub = new PubSub();
var mongoose = require('mongoose');


var books = [];

var Book = mongoose.model('Book', {
  'numberVol': {
    type: Number,
    required: true
  },
  'title': {
    type: String,
    required: true
  },
  'room': {
    type: String,
    required: true
  },
  'bookcase': {
    type: String,
    required: true
  },
  'position': {
    type: Number,
    required: true
  }
});

var resolvers = {
  Query: {
    getBooks: function getBooks(_parentValue, _params) {
      var books = Book.find().exec();
      return books;
    }
  },
  Mutation: {
    addBook: function addBook(_parentValue, _ref) {
      var numberVol = _ref.numberVol,
          title = _ref.title,
          room = _ref.room,
          bookcase = _ref.bookcase,
          position = _ref.position;

      books.push({ numberVol: numberVol, title: title, room: room, bookcase: bookcase, position: position });

      var book = new Book({ numberVol: numberVol, title: title, room: room, bookcase: bookcase, position: position });
      book.save().then(function () {
        return console.log('new book created');
      });

      pubsub.publish('newBookAdded', {
        newBookAdded: { numberVol: numberVol, title: title, room: room, bookcase: bookcase, position: position }
      });

      return books;
    }
  },
  Subscription: {
    newBookAdded: {
      subscribe: withFilter(function () {
        return pubsub.asyncIterator('newBookAdded');
      }, function (_params, _variables) {
        return true;
      })
    }
  }
};

module.exports = {
  resolvers: resolvers,
  Book: Book
};