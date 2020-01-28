'ust strict';

const ObjectId = require('mongodb').ObjectId;
const DBRef = require('mongodb').DBRef;

const collectionName = 'products';

function normalize(obj) {
  if (obj._id) {
    obj._id = new ObjectId(obj._id);
  }

  if (obj.orderId) {
    if (obj.orderId == 'null') {
      obj.orderId = null;
    } else {
      obj.orderId = new DBRef('orders', obj.orderId);
    }
  }

  return obj;
}

module.exports = function(app, db) {
  app.get('/products*', (request, response) => {
    let query = normalize(request.query);
    
    db.collection(collectionName).find(query).toArray((err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result);
    });
  });

  app.post('/products', (request, response) => {
    let product = normalize(request.body);

    db.collection(collectionName).insertOne(product, (err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result.ops[0]);
    });
  });

  app.delete('/products*', (request, response) => {
    let query = normalize(request.query);
    
    db.collection(collectionName).deleteMany(query, (err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result.result);
    });
  });

  app.put('/products*', (request, response) => {
    let query = normalize(request.query);

    let product = normalize(request.body);

    db.collection(collectionName).updateMany(query, {$set: product}, (err, result) => {
      if (err) {
        response.send({'error': 'An error has occured'});
      }

      response.send(result.result);
    });
  });
};
