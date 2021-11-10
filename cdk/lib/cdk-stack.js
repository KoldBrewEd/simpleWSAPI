"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_appsync_1 = require("@aws-cdk/aws-appsync");
class CdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const api = new aws_appsync_1.GraphqlApi(this, 'Api', {
            name: 'WS-API',
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: aws_appsync_1.AuthorizationType.API_KEY
                }
            }
        });
        const channel = new aws_appsync_1.ObjectType('Channel', {
            definition: {
                name: aws_appsync_1.GraphqlType.string({ isRequired: true }),
                data: aws_appsync_1.GraphqlType.awsJson({ isRequired: true }),
            },
        });
        api.addType(channel);
        api.addQuery('getChannel', new aws_appsync_1.Field({
            returnType: channel.attribute()
        }));
        api.addMutation('publish2channel', new aws_appsync_1.ResolvableField({
            returnType: channel.attribute(),
            args: { name: aws_appsync_1.GraphqlType.string({ isRequired: true }), data: aws_appsync_1.GraphqlType.awsJson({ isRequired: true }) },
            dataSource: api.addNoneDataSource('pubsub'),
            requestMappingTemplate: aws_appsync_1.MappingTemplate.fromString(`
        {
          "version": "2017-02-28",
          "payload": {
              "name": "$context.arguments.name",
              "data": $util.toJson($context.arguments.data)
          }
        }`),
            responseMappingTemplate: aws_appsync_1.MappingTemplate.fromString(`$util.toJson($context.result)`)
        }));
        api.addSubscription('subscribe2channel', new aws_appsync_1.Field({
            returnType: channel.attribute(),
            args: { name: aws_appsync_1.GraphqlType.string({ isRequired: true }) },
            directives: [aws_appsync_1.Directive.subscribe('publish2channel')],
        }));
        new cdk.CfnOutput(this, 'graphqlUrl', { value: api.graphqlUrl });
        new cdk.CfnOutput(this, 'apiKey', { value: api.apiKey });
        new cdk.CfnOutput(this, 'apiId', { value: api.apiId });
        new cdk.CfnOutput(this, 'region', { value: this.region });
    }
}
exports.CdkStack = CdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxzREFBa0o7QUFFbEosTUFBYSxRQUFTLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDckMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLHdCQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUN0QyxJQUFJLEVBQUUsUUFBUTtZQUNkLG1CQUFtQixFQUFFO2dCQUNuQixvQkFBb0IsRUFBRTtvQkFDcEIsaUJBQWlCLEVBQUUsK0JBQWlCLENBQUMsT0FBTztpQkFDN0M7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLElBQUksd0JBQVUsQ0FBQyxTQUFTLEVBQUU7WUFDeEMsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSx5QkFBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztnQkFDOUMsSUFBSSxFQUFFLHlCQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQ2hEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVyQixHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxJQUFJLG1CQUFLLENBQUM7WUFDbkMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUU7U0FDaEMsQ0FBQyxDQUFDLENBQUM7UUFFSixHQUFHLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLElBQUksNkJBQWUsQ0FBQztZQUNyRCxVQUFVLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUMvQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUseUJBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRyxJQUFJLEVBQUUseUJBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRztZQUMzRyxVQUFVLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQztZQUMzQyxzQkFBc0IsRUFBRSw2QkFBZSxDQUFDLFVBQVUsQ0FBQzs7Ozs7OztVQU8vQyxDQUNIO1lBQ0QsdUJBQXVCLEVBQUUsNkJBQWUsQ0FBQyxVQUFVLENBQUMsK0JBQStCLENBQUM7U0FDckYsQ0FBQyxDQUFDLENBQUE7UUFFSCxHQUFHLENBQUMsZUFBZSxDQUFDLG1CQUFtQixFQUFFLElBQUksbUJBQUssQ0FBQztZQUNqRCxVQUFVLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUMvQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUseUJBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUN4RCxVQUFVLEVBQUUsQ0FBQyx1QkFBUyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ3JELENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDaEUsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU8sRUFBRSxDQUFDLENBQUE7UUFDekQsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7UUFDdEQsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFFN0QsQ0FBQztDQUNBO0FBdERELDRCQXNEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEdyYXBocWxBcGksIEF1dGhvcml6YXRpb25UeXBlLCBEaXJlY3RpdmUsIE9iamVjdFR5cGUsIEdyYXBocWxUeXBlLCBSZXNvbHZhYmxlRmllbGQsIEZpZWxkLCBNYXBwaW5nVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYyc7XG5cbmV4cG9ydCBjbGFzcyBDZGtTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgR3JhcGhxbEFwaSh0aGlzLCAnQXBpJywge1xuICAgICAgbmFtZTogJ1dTLUFQSScsXG4gICAgICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XG4gICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgY2hhbm5lbCA9IG5ldyBPYmplY3RUeXBlKCdDaGFubmVsJywge1xuICAgICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBuYW1lOiBHcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxuICAgICAgICBkYXRhOiBHcmFwaHFsVHlwZS5hd3NKc29uKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBhcGkuYWRkVHlwZShjaGFubmVsKTtcblxuICAgIGFwaS5hZGRRdWVyeSgnZ2V0Q2hhbm5lbCcsIG5ldyBGaWVsZCh7XG4gICAgICByZXR1cm5UeXBlOiBjaGFubmVsLmF0dHJpYnV0ZSgpXG4gICAgfSkpO1xuXG4gICAgYXBpLmFkZE11dGF0aW9uKCdwdWJsaXNoMmNoYW5uZWwnLCBuZXcgUmVzb2x2YWJsZUZpZWxkKHtcbiAgICAgIHJldHVyblR5cGU6IGNoYW5uZWwuYXR0cmlidXRlKCksXG4gICAgICBhcmdzOiB7IG5hbWU6IEdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgLCBkYXRhOiBHcmFwaHFsVHlwZS5hd3NKc29uKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSAgfSxcbiAgICAgIGRhdGFTb3VyY2U6IGFwaS5hZGROb25lRGF0YVNvdXJjZSgncHVic3ViJyksXG4gICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXG4gICAgICAgIHtcbiAgICAgICAgICBcInZlcnNpb25cIjogXCIyMDE3LTAyLTI4XCIsXG4gICAgICAgICAgXCJwYXlsb2FkXCI6IHtcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiJGNvbnRleHQuYXJndW1lbnRzLm5hbWVcIixcbiAgICAgICAgICAgICAgXCJkYXRhXCI6ICR1dGlsLnRvSnNvbigkY29udGV4dC5hcmd1bWVudHMuZGF0YSlcbiAgICAgICAgICB9XG4gICAgICAgIH1gXG4gICAgICApLFxuICAgICAgcmVzcG9uc2VNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGAkdXRpbC50b0pzb24oJGNvbnRleHQucmVzdWx0KWApXG4gICAgfSkpXG5cbiAgICBhcGkuYWRkU3Vic2NyaXB0aW9uKCdzdWJzY3JpYmUyY2hhbm5lbCcsIG5ldyBGaWVsZCh7XG4gICAgICByZXR1cm5UeXBlOiBjaGFubmVsLmF0dHJpYnV0ZSgpLFxuICAgICAgYXJnczogeyBuYW1lOiBHcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIH0sXG4gICAgICBkaXJlY3RpdmVzOiBbRGlyZWN0aXZlLnN1YnNjcmliZSgncHVibGlzaDJjaGFubmVsJyldLFxuICAgIH0pKTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdncmFwaHFsVXJsJywgeyB2YWx1ZTogYXBpLmdyYXBocWxVcmwgfSlcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnYXBpS2V5JywgeyB2YWx1ZTogYXBpLmFwaUtleSEgfSlcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnYXBpSWQnLCB7IHZhbHVlOiBhcGkuYXBpSWQgfSlcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAncmVnaW9uJywgeyB2YWx1ZTogdGhpcy5yZWdpb24gfSlcbiAgXG59XG59XG4iXX0=