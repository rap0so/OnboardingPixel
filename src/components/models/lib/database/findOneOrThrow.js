module.exports = function (schema) {
  schema.post('findOne', function (res, next) {
    if (!res) {
      return next(new Error('No document found!'));
    }
    return next();
  })
};
