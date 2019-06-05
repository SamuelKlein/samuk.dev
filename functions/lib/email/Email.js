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
const fs = require("fs");
const googleapis_1 = require("googleapis");
const readline = require("readline");
class Email {
    constructor() {
        this.SCOPES = [
            'https://mail.google.com/',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.compose',
            'https://www.googleapis.com/auth/gmail.send',
        ];
        this.TOKEN_PATH = __dirname + '/gmail/credentials.json';
    }
    init() {
        return new Promise((resolve, _) => {
            this.google = new googleapis_1.GoogleApis();
            fs.readFile(__dirname + '/gmail/client_secret.json', (err, content) => {
                this.authorize(JSON.parse(content.toString()), (auth) => {
                    resolve(auth);
                });
            });
        });
    }
    authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new this.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        // Check if we have previously stored a token.
        fs.readFile(this.TOKEN_PATH, (err, token) => {
            if (err) {
                return this.getNewToken(oAuth2Client, callback);
            }
            oAuth2Client.setCredentials(JSON.parse(token.toString()));
            callback(oAuth2Client);
        });
    }
    getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) {
                    return callback(err);
                }
                oAuth2Client.setCredentials(token);
                fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), () => {
                    console.log();
                });
                callback(oAuth2Client);
            });
        });
    }
    enviarEmail(to, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = yield this.init();
            const gmail = this.google.gmail({ version: 'v1', auth });
            const headersObj = {
                'To': to,
                'Subject': subject,
                'Content-Type': 'text/html; charset=utf-8',
            };
            let email = '';
            for (let header in headersObj) {
                if (headersObj.hasOwnProperty(header)) {
                    email += header += ': ' + headersObj[header] + '\r\n';
                }
            }
            email += '\r\n' + message;
            const encodedMessage = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
            return gmail.users.messages.send({ userId: 'me', requestBody: {
                    raw: encodedMessage,
                } });
        });
    }
}
exports.Email = Email;
//# sourceMappingURL=Email.js.map