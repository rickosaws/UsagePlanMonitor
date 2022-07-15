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
