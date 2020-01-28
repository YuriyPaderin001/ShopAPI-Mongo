'use strict';

const ObjectId = require('mongodb').ObjectId;
const DBRef = require('mongodb').DBRef;

const collectionName = 'orders';

function normalize(obj) {
  if (obj._id) {
    obj._id = new ObjectId(obj._id);
  }

  if (obj.buyerId) {
    if (obj.buyerId == 'null') {
      obj.buyerId = null;
    } else {
      obj.buyerId = new DBRef('buyers', obj.buyerId);
    }
  }

  if (obj.date) {
    obj.date = +obj.date;
  }

  return obj;
}

module.exports = function(app, db) {
  app.get('/orders*', (request, response) => {
    let query = normalize(request.query);

    db.collection(collectionName).find(query).toArray((err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result);
    });
  });

  app.post('/orders', (request, response) => {
    let order = normalize(request.body);
    order.date = Date.now();

    db.collection(collectionName).insertOne(order, (err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result.ops[0]);
    });
  });

  app.delete('/orders*', (request, response) => {
    let query = normalize(request.query);

    db.collection(collectionName).deleteMany(query, (err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result.result);
    });
  });

  app.put('/orders*', (request, response) => {
    let query = normalize(request.query);

    let order = normalize(request.body);

    db.collection(collectionName).updateMany(query, {$set: order}, (err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result.result);
    });
  });
};



