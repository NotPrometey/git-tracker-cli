const React = require('react');
const PropTypes = require('prop-types');
const { Box, Color, Text } = require('ink');
const { default: Spinner } = require('ink-spinner');

class Loading extends React.Component {

  render() {

    const { text } = this.props;

    return (
      <Box flexDirection="column">
        <Box>
          <Color green>
            <Spinner type="dots"/>
            <Box marginLeft={2}><Text italic>{text}</Text></Box>
          </Color>
        </Box>
      </Box>
    );
  }
}

Loading.propTypes = {
  text: PropTypes.string
};

Loading.defaultProps = {
  text: 'Loading'
};

module.exports = Loading;
