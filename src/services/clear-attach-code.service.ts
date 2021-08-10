import DocumentRepository from "../repositories/document.repository"
import { deleteFile } from './file.service'
interface Record {
  attach_code: string
  file_name: string
  type: string
  status: string
  expire: number
}

const documentRepository = new DocumentRepository()

export const processDynamoTable = async () => {
  try {

    const records = await documentRepository.findAllInprogress()
    console.log("All dynamo records :: ", records.Items)

    if (records && records.Items && Array.isArray(records.Items) && records.Items.length > 0) {
      const processAllRecords = await Promise.all(records.Items.map(async (e: Record, i: number) => {
        const now = new Date()
        console.log("Now :: ", now)
        const expireTime = new Date(e.expire * 1000)
        console.log("Date time :: ", expireTime)
        if (e.expire && expireTime <= now) {
          // clear here !!
          await documentRepository.delete(e.attach_code)
          await deleteFile(`${e.type}/${e.status}/${e.file_name}`)
        } else {
          console.log("Expire time > Now time")
        }
        return true
      }))
      console.log("Process all  success :: ", processAllRecords)
    }

    return true

  } catch (error) {
    throw error
  }
}
