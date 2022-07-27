var APIDashboard = require("../Dashboards/UsagePlanDashboard.json");

module.exports.buildCloudwatchDashboard = async (UsagePlanData) => {
  if (APIDashboard.widgets) {
    for (var widget in APIDashboard.widgets) {
      var metricData = null;
      if (APIDashboard.widgets[widget].type == "metric") {
        metricData = await addMetricData(UsagePlanData);
        console.log("MetricData", metricData);
        APIDashboard.widgets[widget].type.properties.metrics = metricData || [];
      } else {
        metricData = addAlarmData();
        APIDashboard.widgets[widget].type.properties.alarms = metricData || [];
      }
    }
    //console.log(JSON.stringify(APIDashboard));
  }
};

function GetWidgetData(widgetType) {
  const widgetTypes = {
    metric: "addMetricData",
    alarm: "addAlarmData",
    text: "addTextData",
  };

  return widgetTypes[widgetType.toLowerCase()] ?? "Widget Type not found";
}

async function addAlarmData() {
  // Grab the Alarms and return a filtered list based on the Cloudwatch Namespace
  const AlarmARNs = await CloudWatchUtils.getAlarmARNs(
    process.env.ApplicationId
  );
  console.log("Alarms Array: ", JSON.stringify(getAlarmARNs));
  return AlarmARNs;
}

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

function addMetricData(data) {
  newcwdata = [];
  cwmetricdata.forEach((element) => {
    newcwdata.push([element.namespace, element.name, "API_REQUESTS", "COUNT"]);
  });
  return newcwdata;
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

//var metricData = addtoarray(cwmetricdata);
//var alarmData = addAlarmArn(cwmetricdata);
//dashboard.widgets[0].properties.metrics = metricData;
//dashboard.widgets[1].properties.alarms = alarmData;
//const dashboard_name = "Rickos-test-cw-dashboard";

// var params = {
//   DashboardName: dashboard_name,
//   DashboardBody: JSON.stringify(dashboard),
// };
