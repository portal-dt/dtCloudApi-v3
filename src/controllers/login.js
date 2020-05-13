import jwt from 'jsonwebtoken';

import { db } from '../../config';
import { getUserIdentifier, verifyOTP, otpSecret } from '../utils';

export const login = async (req, res) => {
  try {
    let userIdentifier;
    const { email, transactionId, otp } = req.body;

    if (transactionId) {
      userIdentifier = await getUserIdentifier(transactionId);
    }

    const [ user ] = await db('archive.users').where({
      ...(email && { user_email: email }),
      ...(userIdentifier && { user_identifier: userIdentifier })
    });

    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    if (otp) {
      const base32Secret = user.user_mfa || otpSecret.base32;
      const isOTPValid = verifyOTP(otp, base32Secret);

      if (!isOTPValid) {
        return res.status(403).json({ message: 'Invalid OTP or expired!' });
      }
    }

    if (!user.user_mfa && !transactionId) {
      await db('archive.users')
        .where('user_email', email)
        .update('user_mfa', otpSecret.base32);
    }

    const token = jwt.sign({ id: user.user_guid }, process.env.ACCESS_TOKEN_SECRET, {
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
        isAdmin: user.user_role === 'a'
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
