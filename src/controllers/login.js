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

    const isAdmin = user.user_role === 'a';
    // only admins could login through regular login form
    if (!isAdmin) {
      return res.status(403).json({ message: 'Permissions denied!' });
    }

    const isPasswordValid = compareSync(password, user.user_pw);

    if (!isPasswordValid) {
      return res.status(401).json({ auth: false, accessToken: null, reason: 'Invalid Password!' });
    }

    const token = jwt.sign({ id: user.user_guid }, 'secretKey', {
      expiresIn: 10800 // 3h
    });

    return res.status(200).json({
      auth: true,
      accessToken: token,
      user: {
        id: user.user_guid,
        firstName: user.user_firstname,
        lastName: user.user_lastname,
        email: user.user_email,
        mobile: user.user_mobile,
        language: user.user_locale,
        format: user.user_langauge,
        isAdmin
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
