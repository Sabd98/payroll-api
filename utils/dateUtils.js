module.exports = {
  isWeekend: (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  },

  calculateWorkingDays: (startDate, endDate) => {
    let count = 0;
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }

    return count;
  },

  validateFutureDate: (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) > today;
  },
};
