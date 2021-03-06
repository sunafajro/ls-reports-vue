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

export const getWeeks = (year = moment().format("YYYY")) => {
  const weeks = [{ text: "-выбрать неделю-", value: "" }];
  let start = moment(`${year}-01-01`).startOf("week");
  let end = moment(`${year}-01-01`).endOf("week");
  let i = 1;
  while (start.format("YYYY") <= year) {
    weeks.push({
      end: end.format("YYYY-MM-DD"),
      start: start.format("YYYY-MM-DD"),
      text: `${start.format("DD/MM")}-${end.format("DD/MM")}`,
      value: String(i)
    });
    start = start.add(1, "week");
    end = end.add(1, "week");
    i++;
  }
  return weeks;
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
