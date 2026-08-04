import { describe, expect, it } from "vitest";

import { addDays, todayISO } from "../lib/date";
import { currentBalance, dailyProjectedDelta, forecastBalance } from "../lib/forecast";
import type { AppData, RecurringRule } from "../lib/types";

function baseData(overrides: Partial<AppData> = {}): AppData {
  return {
    startingBalance: 10_000,
    selectedDate: todayISO(),
    transactions: [],
    fixedDailyExpenses: [],
    chartAxis: { top: null, middle: null, bottom: null },
    ...overrides,
  };
}

describe("currentBalance", () => {
  it("sums starting balance with settled transactions up to today", () => {
    const data = baseData({
      transactions: [
        { id: "1", date: todayISO(), type: "income", amount: 2000, memo: "" },
        { id: "2", date: todayISO(), type: "expense", amount: 500, memo: "" },
      ],
    });
    expect(currentBalance(data)).toBe(10_000 + 2000 - 500);
  });
});

describe("forecastBalance", () => {
  it("returns the current balance for today or the past", () => {
    const data = baseData();
    expect(forecastBalance(data, todayISO())).toBe(currentBalance(data));
  });

  it("subtracts fixed daily expenses for each future day", () => {
    const data = baseData({
      fixedDailyExpenses: [{ id: "f1", amount: 300, memo: "昼食" }],
    });
    const target = addDays(todayISO(), 3);
    expect(forecastBalance(data, target)).toBe(currentBalance(data) - 300 * 3);
  });
});

describe("dailyProjectedDelta", () => {
  const rule31: RecurringRule = {
    type: "expense",
    dayOfMonth: 31,
    amount: 1_000,
    memo: "家賃",
  };

  it("fires a day-31 rule on day 31 when the month has one", () => {
    const data = baseData();
    expect(dailyProjectedDelta(data, "2026-01-31", [rule31])).toBe(-1_000);
  });

  it("fires a day-31 rule on the last day of a 30-day month", () => {
    const data = baseData();
    expect(dailyProjectedDelta(data, "2026-04-30", [rule31])).toBe(-1_000);
    expect(dailyProjectedDelta(data, "2026-04-29", [rule31])).toBe(0);
  });

  it("fires a day-31 rule on Feb 28 in a non-leap year", () => {
    const data = baseData();
    expect(dailyProjectedDelta(data, "2026-02-28", [rule31])).toBe(-1_000);
  });

  it("fires a day-31 rule on Feb 29 in a leap year, not Feb 28", () => {
    const data = baseData();
    expect(dailyProjectedDelta(data, "2028-02-28", [rule31])).toBe(0);
    expect(dailyProjectedDelta(data, "2028-02-29", [rule31])).toBe(-1_000);
  });
});
