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

    const customers = await Promise.all(
      customerDbEntries.map(async (customer) => {
        const accountNumberEntries = await db
          .select('storage_md_accounts_array')
          .from('archive.storage')
          .where('storage_user_guid', customer.user_guid);

        const accountNumbers = accountNumberEntries
          .map(({ storage_md_accounts_array }) => storage_md_accounts_array)
          .filter(accountsArray => accountsArray)
          .flat();

        return {
          id: customer.user_guid,
          customerName: `${customer.user_firstname} ${customer.user_lastname}`,
          email: customer.user_email,
          accountNumbers,
          lastLogin: customer.user_last_login
        };
      }));

    return res.status(200).json({ customers });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
