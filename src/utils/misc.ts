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
    (e: any) => parseInt(e.id) % (campaignId + 1) === 0
  );

  expressions.forEach((expression: any) => {
    campaignData = campaignData.filter((d: any) => {
      switch (expression.expression) {
        case EQUALS:
          return d[expression.metric] === parseInt(expression.value);
        case LESSER_THAN:
          return d[expression.metric] < parseInt(expression.value);
        case GREATER_THAN:
          return d[expression.metric] > parseInt(expression.value);
        case DATE_BETWEEN:
          return true;
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
