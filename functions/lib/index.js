"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express = require("express");
const functions = require("firebase-functions");
const Messages_1 = require("./firestore/Messages");
const admin = require("firebase-admin");
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
    const emails = new Messages_1.Messages();
    await emails.send(data.email, `Contact: ${data.name}<${data.email}>`, `${data.name}<br>${data.subject}<br><p>${data.message}</p>`);
    res.send({
        msg: 'OK',
        data,
    });
});
exports.app = functions.https.onRequest(appExpress);
//# sourceMappingURL=index.js.map