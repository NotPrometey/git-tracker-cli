const { flattenDeep } = require('lodash');

const { join } = require('path');

const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const existsSync = fs.existsSync;
const statSync = fs.statSync;


const getDirectories = async (source) => {
  const dirs = await readdir(source);

  const statPromises = dirs
    .map(dirent => stat(join(source, dirent))
      .then(data => ({
        isDirectory: data.isDirectory(),
        name: dirent
      })));

  const stats = await Promise.all(statPromises);

  return stats
    .filter(statData => statData.isDirectory)
    .map(statData => statData.name);
};

const getSubDirectories = async (root) => {

  const allSubDirectories = await getDirectories(root);

  if (allSubDirectories.includes('.git')) {
    return [root];
  }

  const subDirectoriesPromises = allSubDirectories
    .filter(path => path !== 'node_modules')
    .filter(path => path !== 'vendor')
    .map(path => getSubDirectories(join(root, path)));

  const subDirectories = await Promise.all(subDirectoriesPromises);

  return flattenDeep(subDirectories);
};

const existsPath = (path) => existsSync(path);

const isDirectory = (path) => existsPath(path) && statSync(path).isDirectory();

module.exports = {
  getSubDirectories,
  isDirectory
};
