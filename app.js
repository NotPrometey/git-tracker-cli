const React = require('react');
const { Fragment } = require('react');
const PropTypes = require('prop-types');
const moment = require('moment');
const { groupBy, flattenDeep } = require('lodash');
const { exec } = require('child_process');

const { Box, Color, Text } = require('ink');
const { default: Spinner } = require('ink-spinner');

const { join } = require("path")

const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const getDirectories = async (source) => {
  const response = [];
  const data = await readdir(source);

  for (const dirent of data) {
    const s = await stat(dirent)

    if(s.isDirectory()) {
      response.push(dirent)
    }
  }
  return response; 
}

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      out: {},
      errors: [],
      loading: 'Searching',
      isLading: true,
      author: null
    };
  }

  componentDidMount() {
    this.runCommand()
      .catch(e => {
        console.log(e);
        process.exit(1);
      })
  }

  async runCommand() {


    const getAllDirectories = async (directories) => {

      const response = [];

      for (const root of directories) {
        const dir = await getDirectories(root)
        
        if (!dir.length) {
          continue;
        }
  
        if (dir.includes('.git')) {
          response.push(root);
        } else {
          response.push(await getAllDirectories(dir.filter(path => path !== 'node_modules').filter(path => path !== 'vendor').map(path => join(root, path))));
        }
      }

      return response;
    }

    getAllDirectories([this.props.path]).then(async (dirs) => {
      dirs = flattenDeep(dirs)

      function log (path, since, author) {
        return new Promise((resolve, reject) => {
          exec(`git log --since="${since}" --author="${author}" --pretty=format:"${path}|%s|%b|%ci|%an;" --date=format:"%X"`, { cwd: path }, (err, stdout) => {
            if (err) {
              reject(err);
            }

            resolve(stdout);
          });
        });
      }

      function user (path) {
        return new Promise((resolve, reject) => {
          exec(`git config --get user.name`, { cwd: path }, (err, stdout) => {
            if (err) {
              reject(err);
            }

            resolve(stdout.trim());
          });
        });
      }

      for (const path of dirs) {
        let author = this.props.author

        if (!author) {
          author = await user(path);
        }

        this.setState({
          ...this.state,
          loading: path
        });

        let stdout = '';

        try {
          stdout = await log(path, this.props.since, author);
        } catch (e) {
          this.setState({
            ...this.state,
            errors: [...this.state.errors, e.message]
          });
        }

        let items = stdout.split(';')
          .filter(item => item.trim())
          .map(item => item.trim())
          .map(item => {
            const [ path, message = '', body = '', date ] = item.split('|');

            let progect = path.split(/\\|\//).pop();

            if (progect === '.') {
              progect = __dirname.split(/\\|\//).pop();
            }

            return {
              progect, 
              date: moment(date, 'YYYY-MM-DD HH:mm:ss Z'),
              day: moment(date, 'YYYY-MM-DD HH:mm:ss Z').startOf('day').format('DD/MM/YYYY'),
              message,
              body
            }
          })
          .sort((a,b) => {
            return a.date.unix() - b.date.unix();
          });

        items = groupBy(items, 'day');

        for (let day in items) {
          items[day] = items[day].map((data, index, arr) => {

            let endTime = moment(day, 'DD/MM/YYYY').add(this.props.firstHour, 'h');

            if(arr[index - 1]) {
              endTime = arr[index - 1].date
            }
            
            const duration = moment.duration(data.date.diff(endTime));

            data.spend = duration.humanize();
            data.spendTime = duration.asMinutes();
            
            return data;
          });

          items[day] = groupBy(items[day], 'progect');
        }

        this.setState({
          ...this.state,
          out: {...this.state.out, ...items}
        });
      }
      
      this.setState({
        ...this.state,
        isLading: false
      });
    }).catch(e => {
      console.log(e);
      process.exit(1);
    });
  }

	render() {
    const isErrors = this.state.errors.length;
    const isLading = this.state.isLading;
    const isContent = Object.keys(this.state.out).length;
    const out = this.state.out;

		return (
			<Box flexDirection="column">
        {isLading ? (
          <Box>
            <Color green>
              <Spinner type="dots"/>
              <Box marginLeft={2}><Text italic>{this.state.loading}</Text></Box>
            </Color>
          </Box>
        ) : (
          <Fragment>
          {isContent ? (
            <Fragment>
            {Object.keys(out).map(day => (
              <Box flexDirection="column" key={day}>
                {Object.keys(out[day]).map(project => (
                  <Fragment key={project}>
                    <Color green>
                      {day}[{project}]:
                    </Color>
                    <Box marginBottom={1} flexDirection="column">
                      {out[day][project].map((data, key) => (
                        <Box marginLeft={2} width={120} key={key}>
                          <Box flexBasis={20}><Text italic>{data.spend}</Text></Box>
                          <Box flexDirection="column">
                            <Text>{data.message.trim()}</Text>
                            <Text><Color gray>{data.body.trim()}</Color></Text>
                          </Box>
                        </Box>
                      ))}

                      <Color blueBright>
                        <Box borderColor="red" marginLeft={2} width={120}>
                          <Box flexBasis={20}><Text italic>{
                            moment.duration(out[day][project].reduce((prev, current) => {
                              return prev + current.spendTime
                            }, 0), 'm').humanize()
                          }</Text></Box>
                          <Box flexDirection="column">
                            <Text>Total</Text>
                          </Box>
                        </Box>
                      </Color>
                    </Box>
                  </Fragment>
                ))}
              </Box>
            ))}
            </Fragment>
          ) : (
            <Box><Color blueBright>Not Found</Color></Box>
          )}

          {isErrors ? (
            <Box flexDirection="column" marginTop={2}>
              <Box><Color redBright>Errors:</Color></Box>
              {this.state.errors.map((error, key) => (
                <Box marginTop={1} key={key}><Color redBright>{error}</Color></Box>
              ))}
            </Box>
          ) : null }

          </Fragment>
        )}
			</Box>
		);
	}
}

App.propTypes = {
  path: PropTypes.string,
  since: PropTypes.string,
  author: PropTypes.string,
  firstHour: PropTypes.string
};

App.defaultProps = {
  path: '.',
  since: '1 days',
  author: null,
  firstHour: '9'
};

module.exports = App;
