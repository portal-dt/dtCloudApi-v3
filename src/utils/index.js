import { s3 } from '../../config';

export const getDocumentFromS3 = async (documentKey, bucketLink) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      SSECustomerAlgorithm: 'AES256',
      SSECustomerKey: Buffer.from(documentKey, 'base64'),
      Key: bucketLink
    };

    const { Body } = await s3.getObject(params).promise();
    const base64String = Body.toString('base64');

    return `data:application/pdf;base64,${base64String}`;
  } catch (error) {
    throw new Error(`Could not retrieve file from S3 Bucket: ${error.message}`)
  }
};

export const getMappedDocuments = async (data, withContent) => await Promise.all(
  data.map(async (dataEntry) => {
    let document;
    const {
      storage_guid: documentId,
      storage_md_doctype: type,
      storage_s3link: bucketLink,
      storage_secret: documentKey,
      storage_md_duedate: dueDate,
      storage_timestamp: timestamp,
      storage_read_timestamp: openedAt,
      storage_md_invoicedate: invoiceDate,
      storage_md_invoicenumber: invoiceNumber,
    } = dataEntry;

    if (withContent === 'true') {
      document = await getDocumentFromS3(documentKey, bucketLink);
    }

    return {
      documentId,
      type,
      dueDate,
      openedAt,
      invoiceDate,
      invoiceNumber,
      file: document,
      timestamp
    };
  })
);
