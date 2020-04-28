import { db } from '../../config';
import { getMappedDocuments } from '../utils';

export const getDocuments = async (req, res) => {
  try {
    const { content } = req.query;

    const data = await db('archive.storage');

    if (!data.length) {
      return res.status(404).json({ message: 'Documents not found' });
    }

    const mappedDocuments = await getMappedDocuments(data, content);

    const documents = await Promise.all(
      mappedDocuments.map(async (document) => {
        const [userData = {}] = await db
          .select('user_firstname', 'user_lastname', 'user_email')
          .from('archive.users')
          .where({ user_guid: document.userId });

        return {
          ...document,
          userName: `${userData.user_firstname} ${userData.user_lastname}`,
          email: userData.user_email
        };
      })
    );

    return res.status(200).json({ documents });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
