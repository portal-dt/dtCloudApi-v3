import { db } from '../../config';
import { hashSync } from 'bcryptjs';

export const updateUserById = async (req, res) => {
  try {
    const { email, password, mobile, language, format } = req.body;
    const { id } = req.params;

    if (!email && !password && !mobile && !language && !format) {
      return res.status(403).json({ message: 'No correct data specified.' });
    }

    await db('archive.users')
      .where('user_guid', id)
      .update({
        user_email: email,
        user_pw: password && hashSync(password, 8),
        user_mobile: mobile,
        user_language: format,
        user_locale: language
      });

    return res.status(200).json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
