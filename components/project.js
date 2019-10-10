const React = require('react');
const PropTypes = require('prop-types');
const { Box, Color } = require('ink');

const moment = require('moment');

const importJsx = require('import-jsx');

const Line = importJsx('./line');

class Project extends React.Component {

  get totalTime() {
    return moment.duration(this.props.data.reduce((prev, current) => {
      return prev + current.spendTime;
    }, 0), 'm').humanize();
  }

  render() {

    const { day, name, data } = this.props;

    return (
      <>
        <Color green>
          {day}[{name}]:
        </Color>
        <Box marginBottom={1} flexDirection="column">
          {data.map(({ spend, message, body }, key) => (
            <Line
              key={key}
              time={spend}
              message={message.trim()}
              body={body.trim()}
            />
          ))}

          <Color blueBright>
            <Line
              time={this.totalTime}
              message="Total"
            />
          </Color>
        </Box>
      </>
    );
  }
}

Project.propTypes = {
  day: PropTypes.string,
  name: PropTypes.string,
  data: PropTypes.array
};

module.exports = Project;
