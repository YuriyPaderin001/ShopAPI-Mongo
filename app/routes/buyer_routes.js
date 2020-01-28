'use strict';

const ObjectId = require('mongodb').ObjectId;
const DBRef = require('mongodb').DBRef;

const collectionName = 'buyers';

function normalize(obj) {
  if (obj._id) {
    obj._id = new ObjectId(obj._id);
  }

  if (obj.age) {
    obj.age = +obj.age;
  }

  return obj;
};

module.exports = function(app, db) {
  app.get('/buyers*', (request, response) => {
    let query = normalize(request.query);

    db.collection(collectionName).find(query).toArray((err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result);
    }); 
  });

  app.post('/buyers', (request, response) => {
    let buyer = normalize(request.body);
    
    db.collection(collectionName).insertOne(buyer, (err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result.ops[0]);
    });
  });

  app.delete('/buyers*', (request, response) => {
    let query = normalize(request.query);
    console.log(query);

    db.collection(collectionName).deleteMany(query, (err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result.result);
    });
  });

  app.put('/buyers*', (request, response) => {
    let query = normalize(request.query);

    let buyer = normalize(request.body);

    db.collection(collectionName).updateMany(query, {$set: buyer}, (err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result.result);
    });
  });
};
