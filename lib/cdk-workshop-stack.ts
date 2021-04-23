import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigw from '@aws-cdk/aws-apigateway'
import { HitCounter } from "./hitcounter";
import { TableViewer } from 'cdk-dynamo-table-viewer'

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props); //constructor (like classes)

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_10_X, // execution environment
      code: lambda.Code.fromAsset('lambda'), //code lambda directory
      handler: 'hello.handler' // fil is hello, function is handler
    })

    const helloWithinCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });
// defines an API Gateway REST API resource backed by our "hello" function.
   new apigw.LambdaRestApi(this, 'Endpoint', {
     handler: helloWithinCounter.handler
   })

    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithinCounter.table,
      sortBy: 'hits'
    })
  }
}
