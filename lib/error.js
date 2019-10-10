const throwError = message => {
  console.error('\x1b[31m', message ,'\x1b[0m');
  process.exit(1);
};

module.exports = throwError;