const React = require('react');
const PropTypes = require('prop-types');
const { Box, Color, Text } = require('ink');

class Line extends React.Component {

  render() {

    const { time, message, body } = this.props;

    return (
      <Box marginLeft={2} width={120}>
        <Box flexBasis={20}>
          <Text italic>{time}</Text>
        </Box>
        <Box flexDirection="column">
          <Text>{message}</Text>
          <Text>
            <Color gray>{body}</Color>
          </Text>
        </Box>
      </Box>
    );
  }
}

Line.propTypes = {
  time: PropTypes.string,
  message: PropTypes.string,
  body: PropTypes.string
};

module.exports = Line;
