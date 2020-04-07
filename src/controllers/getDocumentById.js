import { db } from '../../config';
import { getDocumentFromS3 } from '../utils';

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [ data ] = await db('archive.storage').where('storage_guid', id);

    if (!data) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const {
      storage_md_doctype: type,
      storage_s3link: bucketLink,
      storage_secret: documentKey,
      storage_read_timestamp: openedAt,
      storage_md_invoicedate: invoiceDate,
      storage_md_invoicenumber: invoiceNumber
    } = data;

    const document = await getDocumentFromS3(documentKey, bucketLink);

    return res.status(200).json({
      id,
      type,
      openedAt,
      invoiceDate,
      invoiceNumber,
      file: document
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};