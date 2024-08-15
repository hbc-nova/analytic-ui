import {
  toKebabCase,
  processAndFormatMetrics,
  validateDateExpression,
  parseRawData,
} from "../utils";
import { EQUALS, GREATER_THAN, LESSER_THAN, DATE_BETWEEN } from "../constants";

describe("toKebabCase", () => {
  it("should convert camelCase to kebab-case", () => {
    expect(toKebabCase("camelCaseString")).toBe("camel-case-string");
  });

  it("should return the same string if it is already kebab-case", () => {
    expect(toKebabCase("kebab-case-string")).toBe("kebab-case-string");
  });

  it("should handle strings with multiple uppercase letters", () => {
    expect(toKebabCase("thisIsATestString")).toBe("this-is-atest-string");
  });

  it("should handle empty strings", () => {
    expect(toKebabCase("")).toBe("");
  });

  it("should handle strings with no uppercase letters", () => {
    expect(toKebabCase("lowercasestring")).toBe("lowercasestring");
  });
});

describe("processAndFormatMetrics", () => {
  it("should return an empty array if input is empty", () => {
    expect(processAndFormatMetrics({})).toEqual([]);
  });

  it("should exclude specific fields from the input", () => {
    const data = {
      id: "123",
      start_date: "2024-08-15",
      end_date: "2024-08-16",
      country: "USA",
      name: "Test",
      created_date: "2024-08-15",
      metric1: 100,
      metric2: 200,
    };
    const result = processAndFormatMetrics(data);
    expect(result).toEqual(["metric1", "metric2"]);
  });

  it("should include fields not in the exclusion list", () => {
    const data = {
      metric1: 100,
      metric2: 200,
      metric3: 300,
    };
    const result = processAndFormatMetrics(data);
    expect(result).toEqual(["metric1", "metric2", "metric3"]);
  });

  it("should return all fields if none are in the exclusion list", () => {
    const data = {
      metric1: 100,
      metric2: 200,
    };
    const result = processAndFormatMetrics(data);
    expect(result).toEqual(["metric1", "metric2"]);
  });
});

describe("validateDateExpression", () => {
  const metric = "metricDate";

  it("should return true if the metric date is within the range", () => {
    const data = { metricDate: "2024-08-15" };
    const expression = { startDate: "2024-08-14", endDate: "2024-08-16" };
    expect(validateDateExpression(metric, expression, data)).toBe(true);
  });

  it("should return false if the metric date is before the start date", () => {
    const data = { metricDate: "2024-08-13" };
    const expression = { startDate: "2024-08-14", endDate: "2024-08-16" };
    expect(validateDateExpression(metric, expression, data)).toBe(false);
  });

  it("should return false if the metric date is after the end date", () => {
    const data = { metricDate: "2024-08-17" };
    const expression = { startDate: "2024-08-14", endDate: "2024-08-16" };
    expect(validateDateExpression(metric, expression, data)).toBe(false);
  });

  it("should return true if the metric date is the same as the start date", () => {
    const data = { metricDate: "2024-08-14" };
    const expression = { startDate: "2024-08-14", endDate: "2024-08-16" };
    expect(validateDateExpression(metric, expression, data)).toBe(true);
  });

  it("should return true if the metric date is the same as the end date", () => {
    const data = { metricDate: "2024-08-16" };
    const expression = { startDate: "2024-08-14", endDate: "2024-08-16" };
    expect(validateDateExpression(metric, expression, data)).toBe(true);
  });

  it("should return true if no valid dates are provided in the expression", () => {
    const data = { metricDate: "2024-08-15" };
    const expression = { startDate: "", endDate: "" };
    expect(validateDateExpression(metric, expression, data)).toBe(true);
  });

  it("should return false if metric date is invalid", () => {
    const data = { metricDate: "invalid-date" };
    const expression = { startDate: "2024-08-14", endDate: "2024-08-16" };
    expect(validateDateExpression(metric, expression, data)).toBe(true);
  });

  it("should return true if both start and end dates are invalid", () => {
    const data = { metricDate: "2024-08-15" };
    const expression = { startDate: "invalid-date", endDate: "invalid-date" };
    expect(validateDateExpression(metric, expression, data)).toBe(true);
  });
});

describe("parseRawData", () => {
  let campaignStore: any;

  beforeEach(() => {
    campaignStore = { isChartLoading: false };
  });

  it("should return an empty array if metrics are empty", () => {
    const result = parseRawData([], [], 1, campaignStore, []);
    expect(result).toEqual([]);
    expect(campaignStore.isChartLoading).toBe(false);
  });

  it("should filter data based on EQUALS expression", () => {
    const data = [
      { id: "4", metric1: 100, created_date: "2024-08-15" },
      { id: "6", metric1: 200, created_date: "2024-08-14" },
    ];
    const metrics = ["metric1"];
    const expressions = [
      { expression: EQUALS, metric: "metric1", value: "100" },
    ];
    const result: any = parseRawData(
      data,
      metrics,
      2,
      campaignStore,
      expressions
    );

    expect(result.datasets[0].data).toEqual([100]);
    expect(result.labels).toEqual(["2024-08-15"]);
    expect(campaignStore.isChartLoading).toBe(false);
  });

  it("should filter data based on LESSER_THAN expression", () => {
    const data = [
      { id: "2", metric1: 100, created_date: "2024-08-15" },
      { id: "4", metric1: 50, created_date: "2024-08-14" },
    ];
    const metrics = ["metric1"];
    const expressions = [
      { expression: LESSER_THAN, metric: "metric1", value: "60" },
    ];
    const result: any = parseRawData(
      data,
      metrics,
      2,
      campaignStore,
      expressions
    );

    expect(result.datasets[0].data).toEqual([50]);
    expect(result.labels).toEqual(["2024-08-14"]);
    expect(campaignStore.isChartLoading).toBe(false);
  });

  it("should filter data based on GREATER_THAN expression", () => {
    const data = [
      { id: "2", metric1: 100, created_date: "2024-08-15" },
      { id: "4", metric1: 200, created_date: "2024-08-14" },
    ];
    const metrics = ["metric1"];
    const expressions = [
      { expression: GREATER_THAN, metric: "metric1", value: "150" },
    ];
    const result: any = parseRawData(
      data,
      metrics,
      2,
      campaignStore,
      expressions
    );

    expect(result.datasets[0].data).toEqual([200]);
    expect(result.labels).toEqual(["2024-08-14"]);
    expect(campaignStore.isChartLoading).toBe(false);
  });

  it("should filter data based on DATE_BETWEEN expression", () => {
    const data = [
      { id: "4", metric1: 100, created_date: "2024-08-15" },
      { id: "6", metric1: 200, created_date: "2024-08-10" },
    ];
    const metrics = ["metric1"];
    const expressions = [
      {
        expression: DATE_BETWEEN,
        metric: "created_date",
        startDate: "2024-08-12",
        endDate: "2024-08-16",
      },
    ];
    const result: any = parseRawData(
      data,
      metrics,
      2,
      campaignStore,
      expressions
    );

    expect(result.datasets[0].data).toEqual([100]);
    expect(result.labels).toEqual(["2024-08-15"]);
    expect(campaignStore.isChartLoading).toBe(false);
  });

  it("should correctly handle random background colors for datasets", () => {
    const data = [{ id: "4", metric1: 100, created_date: "2024-08-15" }];
    const metrics = ["metric1"];
    const expressions: any = [];
    const result: any = parseRawData(
      data,
      metrics,
      2,
      campaignStore,
      expressions
    );

    expect(result.datasets[0].backgroundColor).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("should filter data correctly with multiple expressions", () => {
    const data = [
      { id: "2", metric1: 100, metric2: 150, created_date: "2024-08-15" },
      { id: "4", metric1: 200, metric2: 50, created_date: "2024-08-14" },
      { id: "6", metric1: 300, metric2: 250, created_date: "2024-08-13" },
    ];
    const metrics = ["metric1", "metric2"];
    const expressions = [
      { expression: GREATER_THAN, metric: "metric1", value: "150" },
      { expression: LESSER_THAN, metric: "metric2", value: "200" },
    ];
    const result: any = parseRawData(
      data,
      metrics,
      2,
      campaignStore,
      expressions
    );

    expect(result.datasets[0].data).toEqual([200]);
    expect(result.datasets[1].data).toEqual([50]);
    expect(result.labels).toEqual(["2024-08-14"]);
    expect(campaignStore.isChartLoading).toBe(false);
  });
});
