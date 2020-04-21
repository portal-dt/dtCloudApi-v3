import { db } from '../../config';

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { ssn } = req.query;

    const columnToSelect = ssn === 'true' ? 'user_identifier' : 'user_guid';

    const [ user ] = await db('archive.users').where({
      [columnToSelect]: id
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user: {
        id: user.user_guid,
        firstName: user.user_firstname,
        lastName: user.user_lastname,
        email: user.user_email,
        mobile: user.user_mobile,
        language: user.user_locale,
        format: user.user_langauge
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};