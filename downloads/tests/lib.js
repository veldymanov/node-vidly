const db = require('./db');
const mail =require('./mail');

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

module.exports.notifyCustomer = function(order) {
  const customer = db.getCustomerSync(order.customerId);
  mail.send(customer.email, 'Your order was placed successfully.');
}
