var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" /* process.env.REGION*/ });
var apigateway = new AWS.APIGateway();

module.exports.getUsagePlanDetails = async (params) => {
  try {
    const usagePlanResponseData = await apigateway.getUsage(params).promise();
    return usagePlanResponseData;
  } catch (error) {
    console.info("Unable to retrieve Usage plan quota :", error);
  }
};

module.exports.getAllUsagePlans = async (params) => {
  try {
    const usagePlanData = await apigateway.getUsagePlans(params).promise();

    // Filter the Usage Plans based on the existence of an "ApplicationId" Environment Variable
    if (process.env.ApplicationId) {
      console.log(
        "Application configured to process only Usage Plans with the",
        process.env.ApplicationId + " Tag"
      );
      const ApplicationId = process.env.ApplicationId;
      const filteredUsagePlan = []; // Create an new object for filtered UsagePlans
      usagePlanData.items.forEach((usagePlan) => {
        if (usagePlan.tags && usagePlan.tags.ApplicationId === ApplicationId) {
          filteredUsagePlan.push(usagePlan);
        }
      });
      return filteredUsagePlan;
    } else {
      console.log(
        "No Usage Plans filtering configured. Processing all Usage Plans"
      );
      // Send All UsagePlan items back if "ApplicationId" Environment Variable is not found
      return usagePlanData.items;
    }
  } catch (error) {
    console.error("Unable to retrieve all Usage Plan for the account:", error);
  }
};

module.exports.getUsagePlanKey = async (UsagePlanId, KeyId) => {
  var params = {
    usagePlanId: UsagePlanId.toString(),
    keyId: KeyId.toString(),
  };
  try {
    const KeyDetails = await apigateway.getUsagePlanKey(params).promise();
    return KeyDetails;
  } catch (error) {
    console.info("Unable to retrieve Usage Plan Key details:", error);
  }
};
