"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const functions = require("firebase-functions");
const Email_1 = require("./email/Email");
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
appExpress.post('/email', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = req.body;
    const emails = new Email_1.Email();
    yield emails.enviarEmail('samuel3dstudio@gmail.com', `Contact: ${data.name}<${data.email}>`, `${data.name}<br>${data.subject}<br><p>${data.message}</p>`);
    res.send({
        msg: 'OK',
        data,
    });
}));
exports.app = functions.https.onRequest(appExpress);
//# sourceMappingURL=index.js.map