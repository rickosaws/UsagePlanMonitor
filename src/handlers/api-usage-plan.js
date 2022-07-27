/**
 * A Lambda function that collects API Gateway Quota information and sends the usage statistics to Cloudwatch
 * as a Custom Metric
 *
 * The Solution will check for the existence of a ENV called 'ApplicationId' which is used as a filter to limit the UsagePlans processed
 */
var UsagePlanUtils = require("../utils/UsagePlanUtils.js");
var GeneralUtils = require("../utils/GeneralUtils.js");
var CloudWatchUtils = require("../utils/CloudwatchUtils.js");

exports.UsagePlanHandler = async () => {
  // Get all Usage Plans for the Account
  const GetAllUsagePlans = await UsagePlanUtils.getAllUsagePlans({});

  // Grab the Alarms and return a filtered list based on the Cloudwatch Namespace
  const getthealarmsbro = await CloudWatchUtils.getAlarmARNs(
    process.env.ApplicationId
  );
  console.log("Alarms Array: ", JSON.stringify(getthealarmsbro));

  // Check the response object contains a quota array and send a request to GetUsage to obtain quota values
  for (usagePlan of GetAllUsagePlans) {
    console.log("****** Processing", usagePlan.name + " ******");
    if ("quota" in usagePlan) {
      // Create Date Ranges for Quota data
      const endDateRange =
        GeneralUtils.generateTimestamp("YYYY-MM-DD").toString();
      const startDateRange = GeneralUtils.firstOfTheMonth(
        usagePlan.quota.period,
        endDateRange
      );

      // Build Requeest object for the GetUsage API
      var UsagePlanParams = {};
      UsagePlanParams.endDate = endDateRange;
      UsagePlanParams.startDate = startDateRange;
      UsagePlanParams.usagePlanId = usagePlan.id;

      // Call GetUsage API
      const UsagePlanData = await UsagePlanUtils.getUsagePlanDetails(
        UsagePlanParams
      );

      // Check the response object contains Quota Items and extract the latest Quota value
      if (Object.keys(UsagePlanData.items).length === 0) {
        console.log("No Quota value to send", usagePlan.name);
      } else {
        for (keyId of Object.keys(UsagePlanData.items)) {
          // process each API Key associated with the Usage Plan
          const quotaRemaining = UsagePlanData.items[keyId].pop().pop();
          var keyQuotaData = await UsagePlanUtils.getUsagePlanKey(
            usagePlan.id,
            keyId
          );

          // Build Request Object For Cloudwatch Custom Metrics
          CWRequestParams = {
            namespace:
              usagePlan.tags.ApplicationId || process.env.CloudWatchNameSpace,
            name: keyQuotaData.name,
            quota: usagePlan.quota.limit,
            timestamp: endDateRange,
            remaining: quotaRemaining,
          };

          try {
            MetricDataRequest =
              CloudWatchUtils.buildCWMetricRequest(CWRequestParams);
            // Send a request to CloudWatch Custom Metric via the PutMetric API
            // MetricDataRespose = await CloudWatchUtils.putMetricData(
            //   MetricDataRequest
            // );
          } catch (error) {
            console.info(error);
          }
          console.log(
            "******* Successfully Processed API Key",
            keyQuotaData.name + " ******"
          );
        }
      }
    }
  }
};
