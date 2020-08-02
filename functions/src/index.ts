import * as express from 'express';
import * as functions from 'firebase-functions';
import { Messages } from './firestore/Messages';
import * as  admin from 'firebase-admin';

admin.initializeApp({});

const appExpress = express();
appExpress.use(express.static(__dirname + '/../public'));
appExpress.use(express.json());

appExpress.get('/email', (req, res) => {
    res.send({
        msg: 'OK',
    });
});

appExpress.post('/email', async (req, res) => {
    const data = req.body;
    const emails = new Messages();

    await emails.send(data.email, `Contact: ${data.name}<${data.email}>`, `${data.name}<br>${data.subject}<br><p>${data.message}</p>`);
    res.send({
        msg: 'OK',
        data,
    });
});

export const app = functions.https.onRequest(appExpress);
