const React = require('react');
const PropTypes = require('prop-types');
const { Box, Color } = require('ink');

class Errors extends React.Component {

  render() {

    const { errors } = this.props;

    return (
      <Box flexDirection="column">
        <Box><Color redBright>Errors:</Color></Box>
        {errors.map((error, key) => (
          <Box marginLeft={2} key={key}><Color redBright>{error}</Color></Box>
        ))}
      </Box>
    );
  }
}

Errors.propTypes = {
  errors: PropTypes.array
};

module.exports = Errors;
