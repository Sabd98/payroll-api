const { calculateWorkingDays } = require("../../../utils/dateUtils");
const {
  calculateDailySalary,
  calculateOvertimePay,
  calculateTotalPay,
} = require("../../../utils/payroll");

describe('Payroll Calculations', () => {
    test('calculates working days correctly', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-07');
      expect(calculateWorkingDays(start, end)).toBe(5); // Senin-Jumat
    });
  
    test('calculates daily salary correctly', () => {
      expect(calculateDailySalary(3000, 20)).toBe(150);
    });
  
    test('calculates overtime pay correctly', () => {
      // Gaji 3000, hari kerja 20, lembur 2 jam
      // Gaji per jam = 3000 / (20*8) = 18.75
      // Overtime = 2 * (18.75 * 2) = 75
      expect(calculateOvertimePay(3000, 20, 2)).toBe(75);
    });
  
    test('calculates total pay correctly', () => {
      const result = calculateTotalPay(3000, 20, 18, 5, 50);
      expect(result.baseSalary).toBe(2700); // 18 hari * 150
      expect(result.overtimePay).toBe(187.5); // 5 jam * (18.75 * 2)
      expect(result.totalPay).toBe(2937.5); // 2700 + 187.5 + 50
    });
  
    test('throws error for zero working days', () => {
      expect(() => calculateDailySalary(3000, 0)).toThrow('Working days must be positive');
    });
  });
 