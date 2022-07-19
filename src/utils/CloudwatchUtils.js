var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" /* process.env.REGION*/ });
var cloudwatch = new AWS.CloudWatch();

module.exports.putMetricData = async (params) => {
  try {
    const MetricDataRespose = await cloudwatch.putMetricData(params).promise();
    return MetricDataRespose;
  } catch (error) {
    console.info("Unable to add Cloudwatch Metric :", error);
  }
};

module.exports.listMetricByNamespace = async (namespace) => {
  var params = {
    Namespace: namespace,
  };
  try {
    const MetricDataResponse = await cloudwatch.listMetrics(params).promise();
    return MetricDataResponse;
  } catch (error) {
    console.info("Unable to retrieve Cloudwatch Metric data:", error);
  }
};

module.exports.buildCWMetricRequest = function (CWQuotaMetric) {
  var CWMetricparams = {
    MetricData: [
      {
        MetricName: CWQuotaMetric.name,
        Dimensions: [
          {
            Name: "API_REQUESTS",
            Value: "COUNT",
          },
        ],
        Unit: "None",
        Value: CWQuotaMetric.remaining,
      },
    ],
    Namespace: CWQuotaMetric.namespace,
  };
  return CWMetricparams;
};

// API to add or update Cloudwatch Dashboard
module.exports.putDashboard = async (params) => {
  try {
    const MetricDataRespose = await cloudwatch.putDashboard(params).promise();
    return MetricDataRespose;
  } catch (error) {
    console.info("Unable to add Cloudwatch Dashboard :", error);
  }
};
