module.exports.getCustomerSync = function(id) {
  console.log('Reading a customer from MongoDB...');
  return { id, points: 11, email: 'veldymanov@gmail.com' }
}

module.exports.getCustomer = async function(id) {
  return new Promise((resolve, reject) => {
    resolve({ id, points: 8 });
  });
}
