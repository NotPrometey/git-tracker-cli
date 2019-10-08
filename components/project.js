const React = require('react');
const PropTypes = require('prop-types');
const { Box, Color } = require('ink');

const moment = require('moment');

const importJsx = require('import-jsx');

const Line = importJsx('./line');

class Project extends React.Component {

  render() {

    const { day, name, data } = this.props;

    return (
      <>
        <Color green>
          {day}[{name}]:
        </Color>
        <Box marginBottom={1} flexDirection="column">
          {data.map(({ spend, message, body }, key) => (
            <Line key={key} time={spend} message={message.trim()} body={body.trim()} ></Line>
          ))}

          <Color blueBright>
            <Line time={
                moment.duration(data.reduce((prev, current) => {
                  return prev + current.spendTime;
                }, 0), 'm').humanize()
              } message="Total" ></Line>
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
