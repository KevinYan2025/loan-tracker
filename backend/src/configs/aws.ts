import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS Access Key
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS Secret Key
  region: process.env.AWS_REGION, // The region where your bucket is hosted
});
// s3.listBuckets((err, data) => {
//     console.log(process.env.AWS_ACCESS_KEY_ID);
//     console.log(process.env.AWS_SECRET_ACCESS_KEY);
//     console.log(process.env.AWS_REGION);
    
//     if (err) console.log('Error:', err);
//     else console.log('Success:', data.Buckets);
//   });
// export default s3;

export const uploadFileToS3 = async (file: Express.Multer.File, key: string): Promise<string> => {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || '', // Replace with your bucket name
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  
    const result = await s3.upload(params).promise();
    return result.Location; // Return the public URL of the uploaded file
  };
  
 export  const getPresignedUrls = async (folderPath: string) => {
    try {
        const bucket_name = process.env.AWS_S3_BUCKET_NAME;
        if (!bucket_name) {
          throw new Error('No bucket name provided');
        }
        if (!folderPath) {
          throw new Error('No folder path provided');
        }
      const params: any = {
        Bucket: bucket_name , // Bucket name
        Prefix: folderPath, // Folder path
      };
      
      
      const { Contents } = await s3.listObjectsV2(params).promise();
  
      if (!Contents || !Contents.length) {
        return [];
      }
      
      // Generate pre-signed URLs for each file
      const urls = Contents.map((file: any) => {
        const signedUrl =  s3.getSignedUrl('getObject', {
          Bucket: bucket_name,
          Key: file.Key,
          Expires: 3600, // URL expiration time in seconds
        });
        
        return { fileName: file.Key, url: signedUrl };
      });
      return urls;
    } catch (error) {
      console.error('Error fetching files or generating URLs:', error);
      throw error;
    }
  };

  export const deleteFileFromS3 = async (folderPath: string, isFolder = false): Promise<void> => {
    if (isFolder) {
      const listParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Prefix: folderPath,
      };
      
      const listedObjects = await s3.listObjectsV2(listParams).promise();
      if (!listedObjects.Contents?.length) return;
  
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Delete: { Objects: [] as any[] },
      };
  
      listedObjects.Contents.forEach(({ Key }) => {
        if (Key) deleteParams.Delete.Objects.push({ Key });
      });
  
      await s3.deleteObjects(deleteParams).promise();
  
      if (listedObjects.IsTruncated) await deleteFileFromS3(folderPath, true);
    } else {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: folderPath,
      };
      await s3.deleteObject(deleteParams).promise();
    }
  };