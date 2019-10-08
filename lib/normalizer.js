const moment = require('moment');
const { groupBy } = require('lodash');

function normolize(stdout, { firstHour = 9 } = {}) {
  let items = stdout.split(';')
    .filter(item => item.trim())
    .map(item => {
      const [path, message = '', body = '', date] = item.trim().split('|');

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
      };
    })
    .sort((a, b) => {
      return a.date.unix() - b.date.unix();
    });

  items = groupBy(items, 'day');

  Object.keys(items).forEach(day => {

    items[day] = items[day].map((data, index, arr) => {

      let endTime = moment(day, 'DD/MM/YYYY').add(firstHour, 'h');

      if (arr[index - 1]) {
        endTime = arr[index - 1].date;
      }

      const duration = moment.duration(data.date.diff(endTime));

      return {
        ...data,
        spend: duration.humanize(),
        spendTime: duration.asMinutes()
      };

    });

    items[day] = groupBy(items[day], 'progect');

  });

  return items;
}

module.exports = normolize;
