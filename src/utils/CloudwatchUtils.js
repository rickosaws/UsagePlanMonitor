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

module.exports.tagAlarms = async (alarm) => {
  var params = {
    ResourceARN: alarm.alarmARN /* required */,
    Tags: [
      /* required */
      {
        Key: "ApplicationId" /* required */,
        Value: process.env.ApplicationId /* required */,
      },
      /* more items */
    ],
  };

  try {
    const TagResourceResponse = await cloudwatch.tagResource(params).promise();
    return TagResourceResponse;
  } catch (error) {
    console.info("Unable to tag Cloudwatch Alarm :", error);
  }
};

module.exports.getAlarmARNs = async (alarm) => {
  // var queryparam = {
  //   query: `MetricAlarms[?contains(Namespace, ${process.env.ApplicationId}) == "true"]`,
  // };

  // describeAlarms does not require any mandatory parameters, so creating an empty object
  var params = {};
  try {
    const alarmResponse = await cloudwatch.describeAlarms(params).promise();

    var alarmARNS = [];
    // Iterate through the response adding all the Alarms for the filtered Namespace
    // TODO: This should only be called ;

    for (alarm of alarmResponse) {
      console.log("****** Processing", alarmResponse.name + " ******");

      if (`Namespace.${process.env.ApplicationId}` in alarm) {
        // Create Date Ranges for Quota data
        alarmARNS.push(alarm.AlarmArn);
      }
    }

    return alarmARNS;
  } catch (error) {
    console.info("Unable to retrieve Cloudwatch Alarm :", error);
  }
};
