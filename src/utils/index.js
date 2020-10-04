import moment from "moment";

export const getMaxOfArray = numArray => {
  return Math.max.apply(null, numArray);
};

export const getMonths = () => {
  const months = [{ text: "-выбрать месяц-", value: "" }];
  const date = moment();
  for (let i = 0; i < 12; i++) {
    date.set("month", i);
    months.push({
      text: date.format("MMMM"),
      value: date.format("MM")
    });
  }
  return months;
};

export const getYears = (nullYear = parseInt(moment().format("YYYY"))) => {
  const years = [];
  nullYear = !isNaN(nullYear) ? nullYear : parseInt(moment().format("YYYY"));
  while (nullYear <= parseInt(moment().format("YYYY"))) {
    years.push({
      text: String(nullYear),
      value: String(nullYear)
    });
    nullYear++;
  }
  return years;
};
