import { db } from '../../config';
import { getMappedDocuments } from '../utils';

export const getDocuments = async (req, res) => {
  try {
    const { content } = req.query;

    const data = await db('archive.storage');

    if (!data.length) {
      return res.status(404).json({ message: 'Documents not found' });
    }

    const documents = await getMappedDocuments(data, content);

    return res.status(200).json({ documents });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
