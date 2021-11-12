import * as cdk from '@aws-cdk/core';
import { GraphqlApi, AuthorizationType, Directive, ObjectType, GraphqlType, ResolvableField, Field, MappingTemplate } from '@aws-cdk/aws-appsync';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new GraphqlApi(this, 'Api', {
      name: 'WS-API',
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY
        }
      }
    });

    const channel = new ObjectType('Channel', {
      definition: {
        name: GraphqlType.string({ isRequired: true }),
        data: GraphqlType.awsJson({ isRequired: true }),
      },
    });

    api.addType(channel);

    api.addQuery('getChannel', new Field({
      returnType: channel.attribute()
    }));

    api.addMutation('publish2channel', new ResolvableField({
      returnType: channel.attribute(),
      args: { name: GraphqlType.string({ isRequired: true }), data: GraphqlType.awsJson({ isRequired: true }) },
      dataSource: api.addNoneDataSource('pubsub'),
      requestMappingTemplate: MappingTemplate.fromString(`
        {
          "version": "2017-02-28",
          "payload": {
              "name": "$context.arguments.name",
              "data": $util.toJson($context.arguments.data)
          }
        }`
      ),
      responseMappingTemplate: MappingTemplate.fromString(`$util.toJson($context.result)`)
    }))

    api.addSubscription('subscribe2channel', new Field({
      returnType: channel.attribute(),
      args: { name: GraphqlType.string({ isRequired: true }) },
      directives: [Directive.subscribe('publish2channel')],
    }));

    new cdk.CfnOutput(this, 'graphqlUrl', { value: api.graphqlUrl })
    new cdk.CfnOutput(this, 'apiKey', { value: api.apiKey! })
    new cdk.CfnOutput(this, 'apiId', { value: api.apiId })
    new cdk.CfnOutput(this, 'region', { value: this.region })

  }
}
