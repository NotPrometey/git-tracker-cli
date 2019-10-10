const { isDirectory } = require('./dir');
const throwError = require('./error');

const isHour = function(props, propName) {
  if (typeof props[propName] !== 'number' || (props[propName] <= 0 || props[propName] >= 23)) {
    return throwError(`Invalid prop '${propName}' passed to cli. Expected a valid hour: 0-23.`);
  }

  return null;
};

const isPath = function(props, propName) {
  if (!isDirectory(props[propName])) {
    return throwError(`Invalid prop '${propName}' passed to cli. Expected a valid directory path.`);
  }

  return null;
};

module.exports = {
  isHour,
  isPath
};
