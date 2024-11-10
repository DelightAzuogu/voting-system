const { newError } = require("./newError");

module.exports = function checkDateTime(dateTime) {
  //to make the date for the expiration, ie the one given by the user
  const [date, time] = dateTime.split("T");
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");

  const expireDate = new Date(+year, +month - 1, +day, +hour, +minute);
  const expmil = expireDate.getTime();

  //todays date and time
  const tDate = new Date();
  const tMill = tDate.getTime();

  let timeDif = expmil - tMill;

  //check is the inputed date is less than todays date
  if (timeDif < 0) {
    throw newError("Invalid date", 400);
  }

  //the input time must be 5miuntes ahead
  // if (timeDif < 300000) {
  //   throw newError("5 minutes boundary", 400);
  // }
  return { expmil, tMill };
};
