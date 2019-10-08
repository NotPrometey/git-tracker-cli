const React = require('react');
const importJsx = require('import-jsx');
const PropTypes = require('prop-types');
const { merge } = require('lodash');

const { Box, Color, Text } = require('ink');
const { default: Spinner } = require('ink-spinner');

const { resolve } = require('path');


const getSubDirectories = require('./lib/dir');
const getUserLog = require('./lib/git');
const normolize = require('./lib/normalizer');

const Project = importJsx('./components/project');
const Errors = importJsx('./components/errors');

class App extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      out: {},
      errors: [],
      loading: 'Searching',
      isLading: true,
      author: null
    };
  }

  handleError(e) {
    this.setState({
      ...this.state,
      isLading: false,
      errors: [e.toString()]
    });
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
            ...this.state,
            loading: path
          });

          return getUserLog({ author, since, path })
            .then((stdout) => {
              return normolize(stdout, { 
                firstHour: this.props.firstHour 
              });
            })
            .then(data => {
              this.setState({
                ...this.state,
                out: merge(this.state.out, data)
              });
            });
        });

        await Promise.all(promises);
        
        this.setState({
          ...this.state,
          isLading: false
        });

      })
      .catch(this.handleError.bind(this));
  }

	render() {

    const { errors, isLading, out, loading } = this.state;

    const isErrors = errors.length;
    const isContent = Object.keys(out).length;

		return (
			<Box flexDirection="column">
        {isLading ? (
          <Box>
            <Color green>
              <Spinner type="dots"/>
              <Box marginLeft={2}><Text italic>{loading}</Text></Box>
            </Color>
          </Box>
        ) : (
          <>
          {isContent ? (
            <>
            {Object.keys(out).map(day => (
              <Box flexDirection="column" key={day}>
                {Object.keys(out[day]).map(project => (
                  <Project key={project} day={day} name={project} data={out[day][project]} ></Project>
                ))}
              </Box>
            ))}
            </>
          ) : (
            <Box>
              {!isErrors ? ( <Color blueBright>Not Found</Color> ) : null }
            </Box>
          )}

          {isErrors ? ( <Errors errors={errors} ></Errors> ) : null }

          </>
        )}
			</Box>
		);
	}
}

App.propTypes = {
  path: PropTypes.string,
  since: PropTypes.string,
  author: PropTypes.string,
  firstHour: PropTypes.number
};

App.defaultProps = {
  path: '.',
  since: '1 days',
  author: null,
  firstHour: 9
};

module.exports = App;
