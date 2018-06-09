// eslint-disable-next-line no-restricted-globals
const isDateValidator = date => !isNaN(new Date(date));

module.exports.isDateValidator = isDateValidator;
