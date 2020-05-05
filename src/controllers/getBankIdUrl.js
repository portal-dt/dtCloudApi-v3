import axios from 'axios';

export const getBankIdUrl = async (req, res) => {
  try {
    const { data: { accessUrl } } = await axios
      .post(
        `${process.env.BANK_ID_BASE_URL}/transaction/new`, {
          redirectUrl: `${process.env.PORTAL_WEB_BASE_URL}/`,
          provider: 'noBankID',
          method: 'auth'
        }, {
          headers: { 'Authorization': `Bearer ${process.env.BANK_ID_TOKEN}` }
        }
      );

    return res.status(200).json({ bankIdUrl: accessUrl });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};