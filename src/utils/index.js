import axios from 'axios';
import { s3 } from '../../config';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export const otpSecret = speakeasy.generateSecret({ name: 'dtPortal' });

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
      storage_user_guid: userId,
      storage_s3link: bucketLink,
      storage_secret: documentKey,
      storage_md_duedate: dueDate,
      storage_timestamp: timestamp,
      storage_read_timestamp: openedAt,
      storage_md_invoicedate: invoiceDate,
      storage_md_invoicenumber: invoiceNumber,
      storage_md_ocr: referenceNumber,
      storage_md_amountdue: dueDateAmount,
      storage_md_directdebit: isDirectDebit,
    } = dataEntry;

    if (withContent === 'true') {
      document = await getDocumentFromS3(documentKey, bucketLink);
    }

    return {
      documentId,
      type,
      userId,
      dueDate,
      openedAt,
      invoiceDate,
      invoiceNumber,
      referenceNumber,
      isDirectDebit,
      dueDateAmount,
      file: document,
      timestamp
    };
  })
);

export const getUserIdentifier = async (transactionId) => {
  const {
    data: { providerInfo: { noBankIDAuth } }
  } = await axios.get(
    `${process.env.BANK_ID_BASE_URL}/transaction/${transactionId}`,
    { headers: { 'Authorization': `Bearer ${process.env.BANK_ID_TOKEN}` } }
    );

  return noBankIDAuth.completionData.ssn;
};

export const getQRCode = async () => await qrcode.toDataURL(otpSecret.otpauth_url);

export const verifyOTP = (token, secret) => speakeasy.totp.verify({
  encoding: 'base32',
  secret,
  token
});