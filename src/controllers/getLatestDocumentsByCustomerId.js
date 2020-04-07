import { db } from '../../config';
import { getMappedDocuments } from '../utils';

export const getLatestDocumentsByCustomerId = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.query;

    const data = await db('archive.storage')
      .where('storage_md_debtorid', id)
      .orderBy('storage_timestamp', 'desc')
      .limit(5);

    if (!data.length) {
      return res.status(404).json({ message: 'Documents not found' });
    }

    const documents = await getMappedDocuments(data, content);

    return res.status(200).json({ customerId: id, documents });

  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
