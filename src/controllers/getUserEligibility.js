import { compareSync } from 'bcryptjs';

import { db } from '../../config';
import { getQRCode } from '../utils';

export const getUserEligibility = async (req, res) => {
  try {
    const { email, password } = req.body;
    let qrCode;

    const [ user ] = await db
      .select('user_mfa', 'user_pw', 'user_role')
      .where('user_email', email)
      .from('archive.users');

    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    const isAdmin = user.user_role === 'a';

    if (!isAdmin) {
      return res.status(403).json({ message: 'Permissions denied!' });
    }

    const isPasswordValid = password && compareSync(password, user.user_pw);

    if (!isPasswordValid) {
      return res.status(401).json({ eligible: false, reason: 'Invalid Password!' });
    }

    if (!user.user_mfa) {
      qrCode = await getQRCode();
    }

    return res.status(200).json({
      eligible: true,
      mfaEnabled: user.user_mfa,
      qrCode
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
