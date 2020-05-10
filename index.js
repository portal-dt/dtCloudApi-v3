import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { verifyToken } from './middleware';

import { getDocumentById } from './src/controllers/getDocumentById';
import { getDocuments } from './src/controllers/getDocuments';
import { getCustomers } from './src/controllers/getCustomers';
import { getDocumentsByCustomerId } from './src/controllers/getDocumentsByCustomerId';
import { updateDocumentOpened } from './src/controllers/updateDocumentOpened';
import { getLatestDocumentsByCustomerId } from './src/controllers/getLatestDocumentsByCustomerId';
import { updateUserById } from './src/controllers/updateUserById';
import { getUserById } from './src/controllers/getUserById';
import { login } from './src/controllers/login';
import { getBankIdUrl } from './src/controllers/getBankIdUrl';
import { getUserEligibility } from './src/controllers/getUserEligibility';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/v3/archive/documents', verifyToken, getDocuments);
app.get('/v3/archive/documents/:id', verifyToken, getDocumentsByCustomerId);
app.get('/v3/archive/documents/latest/:id', verifyToken, getLatestDocumentsByCustomerId);
app.get('/v3/archive/customers', verifyToken, getCustomers);
app.get('/v3/archive/document/:id', verifyToken, getDocumentById);
app.put('/v3/archive/document', verifyToken, updateDocumentOpened);
app.put('/v3/users/:id', verifyToken, updateUserById);
app.get('/v3/users/:id', verifyToken, getUserById);

app.post('/v3/login', login);
app.get('/v3/bankIdUrl',  getBankIdUrl);
app.post('/v3/eligibility', getUserEligibility);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(process.env.PORT || 5000, () => console.log('yo'));
