'use strict';

const productRoutes = require('./product_routes');
const buyerRoutes = require('./buyer_routes');
const orderRoutes = require('./order_routes');

module.exports = function(app, db) {
  productRoutes(app, db);
  buyerRoutes(app, db);
  orderRoutes(app, db);
}
