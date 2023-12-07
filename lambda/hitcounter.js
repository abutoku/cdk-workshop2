const { DynamoDB, Lambda } = require('aws-sdk');

exports.handler = async function(event) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  const dynamo = new DynamoDB();
  const lambda = new Lambda();

  await dynamo.updateItem({
    // 未定のテーブル名を環境変数から取得
    TableName: process.env.HITS_TABLE_NAME,
    Key: { path: { S: event.path } },
    UpdateExpression: 'ADD hits :incr',
    ExpressionAttributeValues: { ':incr': { N: '1' } }
  }).promise();

  const resp = await lambda.invoke({
    // 未定のLambda関数名を環境変数から取得
    FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
    Payload: JSON.stringify(event)
  }).promise();

  console.log('downstream response:', JSON.stringify(resp, undefined, 2));

  return JSON.parse(resp.Payload);
};