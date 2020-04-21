import { db } from '../../config';
import { getMappedDocuments } from '../utils';

// id for testing 19096226325
export const getDocumentsByCustomerId = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.query;

    const data = await db('archive.storage').where('storage_user_guid', id); // to sue customer id

    if (!data.length) {
      return res.status(404).json({ message: 'Documents not found' });
    }

    const documents = await getMappedDocuments(data, content);

    return res.status(200).json({ customerId: id, documents });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};