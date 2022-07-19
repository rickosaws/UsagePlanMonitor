module.exports.insertMetricData = async (params) => {
  try {
    const MetricDataRespose = await cloudwatch.putMetricData(params).promise();
    return MetricDataRespose;
  } catch (error) {
    console.info("Unable to add Cloudwatch Metric :", error);
  }
};

function buildCWMetricsArray(data, template) {
  /* 
Takes a data object and template and builds a Mutli Dimensional Array. This is required for CloudWatch Metrics Widgets
*/
  const mdArrayObj = [];
  data.forEach((element) => {
    mdArrayObj.push([element.namespace, element.name, template]);
  });
  return mdArrayObj;
}

function addAlarmArn(data) {
  newcwdata = [];
  cwmetricdata.forEach((element) => {
    if ("alarmARN" in element) {
      newcwdata.push(element.alarmARN);
    }
  });
  return newcwdata;
}
/*
The following code is WIP from my POC 
*/

var cwmetricdata = [
  {
    namespace: "CAPI",
    name: "customer2",
    alarmARN:
      "arn:aws:cloudwatch:ap-southeast-2:723002825476:alarm:Customer1APIKeyUsageAlarm",
  },
  {
    namespace: "CAPI",
    name: "customer3",
    alarmARN:
      "arn:aws:cloudwatch:ap-southeast-2:723002825476:alarm:Customer 2 API Alarm",
  },
  {
    namespace: "CAPI",
    name: "customer4",
  },
];

var metricData = addtoarray(cwmetricdata);
var alarmData = addAlarmArn(cwmetricdata);
dashboard.widgets[0].properties.metrics = metricData;
dashboard.widgets[1].properties.alarms = alarmData;
const dashboard_name = "Rickos-test-cw-dashboard";

var params = {
  DashboardName: dashboard_name,
  DashboardBody: JSON.stringify(dashboard),
};
