const db = require('./db');

module.exports.absolute = number => number >= 0 ? number : -number;

module.exports.greet = function(name) {
  return 'Welcome ' + name + '!';
}

module.exports.getCurrencies = function() {
  return ['USD', 'AUD', 'EUR'];
}

module.exports.getProduct = function(productId) {
  return { id: productId, price: 10};
}

module.exports.registerUser = function(username) {
  if (!username) throw new Error('Username is required.');

  return { id: new Date().getTime(), username };
}

module.exports.applyDiscount = function(order) {
  const customer = db.getCustomerSync(order.customerId);

  if (customer.points > 10) order.totalPrice *= 0.9;
}
