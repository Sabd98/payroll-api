const { isWeekend } = require("../../../utils/dateUtils");

describe("Date Utilities", () => {
  test("should identify Saturday as weekend", () => {
    const saturday = new Date("2024-01-06");
    expect(isWeekend(saturday)).toBe(true);
  });

  test("should identify Sunday as weekend", () => {
    const sunday = new Date("2024-01-07");
    expect(isWeekend(sunday)).toBe(true);
  });

  test("should identify Monday as weekday", () => {
    const monday = new Date("2024-01-01");
    expect(isWeekend(monday)).toBe(false);
  });
});
