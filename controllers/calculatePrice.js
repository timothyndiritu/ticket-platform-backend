function extractTotalMinutes(inputString) {
  let parts = inputString.split(" ");

  let totalMinutesIndex = parts.indexOf("totalMinutes");

  if (totalMinutesIndex !== -1 && totalMinutesIndex + 1 < parts.length) {
    const totalMinutes = parseInt(parts[totalMinutesIndex + 1]); // Parse the total minutes as an integer

    const price = calculateParkingPrice(totalMinutes);
    return price;
  } else {
    return null; // Return null if 'minutes' or the subsequent value is not found
  }
}

// Function to calculate parking price based on total time duration in minutes
function calculateParkingPrice(totalTimeInMinutes) {
  let price = 0;

  const totalDays = Math.floor(totalTimeInMinutes / 1440); // Calculate total days
  const remainingTime = totalTimeInMinutes % 1440; // Calculate remaining time in minutes

  // Calculate price for total days
  price = totalDays * 1000;

  // Calculate price for remaining time if any
  if (remainingTime <= 30) {
    price += 100;
  } else if (remainingTime <= 60) {
    price += 150;
  } else if (remainingTime <= 120) {
    price += 200;
  } else if (remainingTime <= 240) {
    price += 300;
  } else if (remainingTime <= 480) {
    price += 400;
  } else if (remainingTime <= 720) {
    price += 500;
  } else if (remainingTime <= 1440) {
    price += 750;
  }

  return price;
}

module.exports = extractTotalMinutes;
