const { exec } = require('child_process');

function run(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (err, stdout) => {
      if (err) {
        reject(err);
      }

      resolve(stdout.trim());
    });
  });
}

function log(path, since, author) {
  return run(`git log --since="${since}" --author="${author}" --pretty=format:"${path}|%s|%b|%ci|%an;" --date=format:"%X"`, path);
}

function user(path) {
  return run(`git config --get user.name`, path);
}

async function getUserLog({ author = null, path, since }) {
  const currentAuthor = author || await user(path);

  try {
    return await log(path, since, currentAuthor);
  } catch (e) {
    throw e;
  }
}

module.exports = getUserLog;
