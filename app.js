const React = require('react');
const importJsx = require('import-jsx');
const PropTypes = require('prop-types');
const { merge } = require('lodash');

const { Box, Color } = require('ink');

const { resolve } = require('path');

const { getSubDirectories } = require('./lib/dir');
const getUserLog = require('./lib/git');
const normolize = require('./lib/normalizer');
const validate = require('./lib/validate');

const Project = importJsx('./components/project');
const Loading = importJsx('./components/loading');

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      out: {},
      loading: 'Searching',
      isLading: true,
      author: null
    };
  }

  handleError(e) {
    this.setState({
      isLading: false
    });

    throw e;
  }

  componentDidMount() {
    this.runCommand()
      .catch(this.handleError.bind(this));
  }

  async runCommand() {

    const { author, since } = this.props;

    getSubDirectories(resolve(this.props.path))
      .then(async (dirs) => {

        const promises = dirs.map(path => {
          this.setState({
            loading: path
          });

          return getUserLog({ author, since, path })
            .then((stdout) => {
              return normolize(stdout, {
                firstHour: this.props.firstHour
              });
            })
            .then(data => {
              this.setState((state) => ({ out: merge(state.out, data) }));
            });
        });

        await Promise.all(promises);

        this.setState({
          isLading: false
        });

      })
      .catch(this.handleError.bind(this));
  }

  render() {

    const { isLading, out, loading } = this.state;

    const isContent = Object.keys(out).length;

    if (isLading) {
      return <Loading text={loading}/>;
    }

    return (
      <Box flexDirection="column">

        {isContent ? (
          <>
            {Object.keys(out).map(day => (
              <Box flexDirection="column" key={day}>
                {Object.keys(out[day]).map(project => (
                  <Project
                    key={day + project}
                    day={day}
                    name={project}
                    data={out[day][project]}
                  />
                ))}
              </Box>
            ))}
          </>
        ) : (
          <Box>
            <Color blueBright>Not Found</Color>
          </Box>
        )}

      </Box>
    );
  }
}

App.propTypes = {
  since: PropTypes.string,
  author: PropTypes.string,
  firstHour: validate.isHour,
  path: validate.isPath,
};

App.defaultProps = {
  path: '.',
  since: '1 days',
  author: null,
  firstHour: 9
};

module.exports = App;
