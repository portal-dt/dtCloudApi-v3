import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { getDocumentById } from './src/controllers/getDocumentById';
import { getDocumentsByCustomerId } from './src/controllers/getDocumentsByCustomerId';
import { updateDocumentOpened } from './src/controllers/updateDocumentOpened';
import { getLatestDocumentsByCustomerId } from './src/controllers/getLatestDocumentsByCustomerId';

const app = express();

app.use(cors());
app.use(bodyParser.json());



app.get('/v3/archive/:id', getDocumentById);
app.get('/v3/archive/documents/:id', getDocumentsByCustomerId);
app.get('/v3/archive/documents/latest/:id', getLatestDocumentsByCustomerId);
app.post('/v3/archive/document', updateDocumentOpened);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(process.env.PORT || 5000, () => console.log('yo'));


// test doc id 000B3602-13DB-9546-A010-EE7DAA4CA816

// customer id for testing 100005262 (note: this is not customer id)