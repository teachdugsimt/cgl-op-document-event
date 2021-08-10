import AWS from 'aws-sdk'

export interface S3Body {
  Bucket: string
  Key: string
}

const _deleteFileInSrcPath = (params: S3Body, s3: AWS.S3) => {
  return new Promise((resolve) => {
    s3.deleteObject(params, (data) => {
      resolve(data)
    })
  })
}

export const deleteFile = async (key: string) => {
  const s3: AWS.S3 = new AWS.S3();
  const params: S3Body = {
    Bucket: process.env.DOCUMENT_BUCKET || "cargolink-documents",
    Key: key
  }
  return _deleteFileInSrcPath(params, s3)
}
