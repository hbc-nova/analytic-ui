import moment from "moment";
import { DATE_BETWEEN, EQUALS, GREATER_THAN, LESSER_THAN } from "../constants";

export function toKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function processAndFormatMetrics(data: any) {
  const input = Object.keys(data || {});

  if (!input.length) return [];

  const fieldsToExclude = [
    "id",
    "start_date",
    "end_date",
    "country",
    "name",
    "created_date",
  ];
  return input.filter((key) => !fieldsToExclude.includes(key));
}

export function validateDateExpression(
  metric: any,
  expression: any,
  data: any
) {
  const { startDate, endDate } = expression;
  const parsedStartDate = startDate ? moment(startDate) : moment.invalid();
  const parsedEndDate = endDate ? moment(endDate) : moment.invalid();
  const parsedMetricDate = data[metric]
    ? moment(data[metric])
    : moment.invalid();
  let isEligible = true;
  if (
    !parsedMetricDate.isValid() ||
    !(parsedStartDate.isValid() || parsedEndDate.isValid())
  )
    return isEligible;

  if (parsedStartDate.isValid())
    isEligible = parsedMetricDate.isSameOrAfter(parsedStartDate);

  if (isEligible && parsedEndDate.isValid())
    isEligible = parsedMetricDate.isSameOrBefore(parsedEndDate) && isEligible;

  return isEligible;
}

export function parseRawData(
  data: any,
  metrics: any,
  campaignId: number,
  campaignStore: any,
  expressions: any
) {
  const labels: any = [];
  if (!metrics?.length) return [];
  campaignStore.isChartLoading = true;

  let campaignData = data.filter(
    (e: any) => parseInt(e.id) % (campaignId + 2) === 0
  );

  expressions.forEach((expression: any) => {
    const { expression: ex, metric, value } = expression;

    if (!ex || !metric) return;

    campaignData = campaignData.filter((d: any) => {
      switch (ex) {
        case EQUALS:
          return d[metric] === parseInt(value);
        case LESSER_THAN:
          return d[metric] < parseInt(value);
        case GREATER_THAN:
          return d[metric] > parseInt(value);
        case DATE_BETWEEN:
          return validateDateExpression(metric, expression, d);
        default:
          return true;
      }
    });
  });

  const parsedData = campaignData.reduce((accumulator: any, val: any) => {
    metrics.forEach((metric: string) => {
      if (!accumulator[metric]) {
        accumulator[metric] = {
          label: metric,
          backgroundColor: `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`,
          data: [],
        };
      }
      accumulator[metric].data.push(val[metric]);
    });
    labels.push(val["created_date"].substring(0, 10));
    return accumulator;
  }, {});

  campaignStore.isChartLoading = false;

  return { labels, datasets: Object.values(parsedData) };
}
