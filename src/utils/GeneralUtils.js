const moment = require("moment");

module.exports.generateTimestamp = (format) => {
  if (format === "" || format === undefined) {
    format = "YYYY-MM-DD-THH-mm-ssZ";
  }
  const now = moment().utc();
  const timeStamp = now.format(format);
  return timeStamp;
};

module.exports.firstOfTheMonth = (currentDate, endDate) => {
  const dateOffset = currentDate; // Grab the Period from the UsagePlan details
  if (dateOffset === "MONTH") {
    return moment(endDate) // Set the Start date to the beginging of the month
      .startOf("Month")
      .format("YYYY-MM-DD")
      .toString();
  }
};
