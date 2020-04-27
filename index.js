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

const app = express();

app.use(cors());
app.use(bodyParser.json());

//todo add verifyToken middleware

app.get('/v3/archive/documents', getDocuments);
app.get('/v3/archive/documents/:id', getDocumentsByCustomerId);
app.get('/v3/archive/documents/latest/:id', getLatestDocumentsByCustomerId);
app.get('/v3/archive/customers', getCustomers);
app.get('/v3/archive/document/:id', getDocumentById);
app.put('/v3/archive/document', updateDocumentOpened);
app.put('/v3/users/:id', updateUserById);
app.get('/v3/users/:id', getUserById);

app.post('/v3/login', login);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(process.env.PORT || 5000, () => console.log('yo'));
