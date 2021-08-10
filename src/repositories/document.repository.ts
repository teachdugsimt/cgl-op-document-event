import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export interface AttachCode {
  attach_code: string
  file_name: string
  user_id?: string
  type?: string
  status?: string
}

const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'ap-southeast-1' })

export default class DocumentRepository {

  async findAllInprogress(): Promise<any> {
    const params: DocumentClient.ScanInput = {
      TableName: process.env.TABLE_ATTACH_CODE || 'cgl_attach_code',
      FilterExpression: "#st = :st",
      ExpressionAttributeValues: {
        ":st": "INPROGRESS"
      },
      ExpressionAttributeNames: {
        "#st": "status"
      },
    };
    return await documentClient.scan(params).promise();
  }

  async batchDelete(attachCode: string[], table?: string): Promise<any> {
    const mappingArray: { DeleteRequest: { Key: { attach_code: string } } }[] = []
    const fromTable: string = table ? table : (process.env.TABLE_ATTACH_CODE || 'cgl_attach_code')
    attachCode.map(e => mappingArray.push({
      DeleteRequest: {
        Key: {
          'attach_code': e
        }
      }
    }))

    const params: DocumentClient.BatchWriteItemInput = {
      "RequestItems": {
        [`${fromTable}`]: mappingArray
      },
    };
    console.log("Params batch delete :: ", params.RequestItems.cgl_attach_code)
    return await documentClient.batchWrite(params).promise()
  }

  async delete(attachCode: string): Promise<any> {
    const params = {
      TableName: process.env.TABLE_ATTACH_CODE || 'cgl_attach_code',
      Key: {
        attach_code: attachCode,
      }
    };

    return await documentClient.delete(params).promise();
  }

}



// const main = async () => {
//   const repo = new DocumentRepository()
//   const result = await repo.delete('test123')
//   console.log("Result :: ", result)
// }
// main()
