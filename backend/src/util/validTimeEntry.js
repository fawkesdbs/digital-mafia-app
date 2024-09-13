const moment = require("moment");

const isValidTimeEntry = (entryDateTime) => {
  const entryMoment = moment(entryDateTime);
  const nowMoment = moment();

  const isToday = entryMoment.isSame(nowMoment, "day");

  if (isToday) {
    return entryMoment.isBefore(nowMoment) || entryMoment.isSame(nowMoment);
  } else {
    return entryMoment.isBefore(nowMoment.startOf("day"));
  }
};

module.exports = { isValidTimeEntry };
