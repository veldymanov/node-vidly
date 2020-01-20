module.exports.getCustomerSync = function(id) {
  return { id, points: 13 }
}

module.exports.getCustomer = async function(id) {
  return new Promise((resolve, reject) => {
    console.log('Reading a customer from MongoDB...');
    resolve({ id, points: 13 });
  });
}
