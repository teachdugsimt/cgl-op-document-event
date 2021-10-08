import { processDynamoTable } from './services/clear-attach-code.service'
export const handler = async (event: any, context: any, callback: any): Promise<any> => {
  try {
    console.log("Event Schedule :: => ", event)
    const response = await processDynamoTable()
    console.log("Response handler : ", response)
    if (response) return true;
    else return false;

  } catch (err: any) {
    console.log('err :>> ', err);
    return new Error(err);
    ;
  }
};
