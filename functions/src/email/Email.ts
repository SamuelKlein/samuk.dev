import * as fs from 'fs';
import { GoogleApis } from 'googleapis';
import * as readline from 'readline';

export class Email {

    private google: GoogleApis;

    private SCOPES = [
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/gmail.send',
    ];

    private TOKEN_PATH = __dirname + '/gmail/credentials.json';

    private init() {
        return new Promise<string>((resolve, _) => {
            this.google = new GoogleApis();
            fs.readFile(__dirname + '/gmail/client_secret.json', (err, content) => {
                this.authorize(JSON.parse(content.toString()), (auth) => {
                    resolve(auth);
                });
            });
        });
    }

    private authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new this.google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(this.TOKEN_PATH, (err, token) => {
            if (err) {
                return this.getNewToken(oAuth2Client, callback);
            }
            oAuth2Client.setCredentials(JSON.parse(token.toString()));
            callback(oAuth2Client);
        });
    }

    private getNewToken(oAuth2Client, callback) {
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

    public async enviarEmail(to: string, subject: string, message: string) {
        const auth = await this.init();
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

        return gmail.users.messages.send({userId: 'me', requestBody: {
            raw: encodedMessage,
        }});
    }
}

