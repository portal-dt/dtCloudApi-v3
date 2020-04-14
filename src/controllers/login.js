import jwt from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';

import { db } from '../../config';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [ user ] = await db('archive.users').where({
      user_email: email
    });

    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    const isPasswordValid = compareSync(password, user.user_pw);

    if (!isPasswordValid) {
      res.status(401).json({ auth: false, accessToken: null, reason: 'Invalid Password!' });
    }

    const token = jwt.sign({ id: user.user_guid }, 'secretKey', {
      expiresIn: 10800 // 3h
    });

    res.status(200).json({
      auth: true,
      accessToken: token,
      user: {
        id: user.user_guid,
        firstName: user.user_firstname,
        lastName: user.user_lastname,
        email: user.user_email,
        mobile: user.user_mobile,
        locale: user.user_locale,
        language: user.user_language
      }
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
