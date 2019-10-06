#!/usr/bin/env node
'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const { render } = require('ink');
const meow = require('meow');

const App = importJsx('./app');

const cli = meow(`
	Usage: git-tracker [OPTION]...

	Mandatory arguments to long options are mandatory for short options too.

	 --path=<path>          Current directory by default
	 --since=<date>         The last day by default
	 --author=<author>      Current user by default
	 --first-hour=<time>    9 by default

	  --help     display this help and exit
	  --version  output version information and exit
`);

render(React.createElement(App, cli.flags));
