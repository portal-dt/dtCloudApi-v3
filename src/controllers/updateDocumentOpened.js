import { db } from '../../config';

export const updateDocumentOpened = async (req, res) => {
  try {
    const { documentId, openedAt } = req.body;

    if (!openedAt && !documentId) {
      return res.status(403).json({ message: 'No correct data specified.' });
    }

    await db('archive.storage')
      .where('storage_md_debtorid', documentId)
      .update('storage_read_timestamp', openedAt);

    return res.status(200).json({ message: 'Updated successfully' });

  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
