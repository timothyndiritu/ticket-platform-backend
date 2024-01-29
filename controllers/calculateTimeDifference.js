function calculateTime(ticketTime) {
  const providedTime = new Date(`${ticketTime}`);
  const currentTime = new Date();

  const timeDifference = currentTime - providedTime;

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const millisecondsPerHour = 60 * 60 * 1000;
  const millisecondsPerMinute = 60 * 1000;

  const totalMinutes = Math.floor(timeDifference / millisecondsPerMinute)
  const days = Math.floor(timeDifference / millisecondsPerDay);
  const remainingHours = timeDifference % millisecondsPerDay;
  const hours = Math.floor(remainingHours / millisecondsPerHour);
  const remainingMinutes = remainingHours % millisecondsPerHour;
  const minutes = Math.floor(remainingMinutes / millisecondsPerMinute);

  // console.log(`${days} days, ${hours} hours, and ${minutes} minutes.`);
  
  return `${days} days, ${hours} hours, and ${minutes} minutes and totalMinutes ${totalMinutes}.`
}

function cutPeice(originalString) {
  let indexOfAnd = originalString.indexOf(' and totalMinutes');

  let extractedString = originalString.substring(0, indexOfAnd);
  
  return extractedString;
}

module.exports = { calculateTime , cutPeice};