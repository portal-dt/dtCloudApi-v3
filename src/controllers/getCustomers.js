import { db } from '../../config';

export const getCustomers = async (req, res) => {
  try {
    const customerDbEntries = await db
      .select(
        'user_firstname',
        'user_lastname',
        'user_email',
        'user_last_login',
        'user_guid'
      )
      .where('user_role', 'c')
      .from('archive.users');

    if (!customerDbEntries.length) {
      return res.status(404).json({ message: 'Customers not found!' });
    }

    const customers = customerDbEntries.map((customer, i) => ({
      id: customer.user_guid,
      customerName: `${customer.user_firstname} ${customer.user_lastname}`,
      email: customer.user_email,
      accountNumber: i,
      lastLogin: customer.user_last_login
    }));

    return res.status(200).json({ customers });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
