import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface HitCounterProps {
  downstream: lambda.IFunction;
}

export class HitCounter extends Construct {

  public readonly handler: lambda.Function;
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    const table = new dynamodb.Table(this, 'Hits', {
        partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING },
        // スタック削除時にDynamoDBテーブルを削除
        removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    this.table = table;

    this.handler = new lambda.Function(this, 'HitCounterHandler', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'hitcounter.handler',
        code: lambda.Code.fromAsset('lambda'),
        environment: {
            // 環境変数と紐付ける
            DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
            HITS_TABLE_NAME: table.tableName
        }
    });

    // テーブルに対する読み書き権限を付与
    table.grantReadWriteData(this.handler);
    // ダウンストリーム関数に対する権限を付与
    props.downstream.grantInvoke(this.handler);
  }
}