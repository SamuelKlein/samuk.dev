import * as  admin from 'firebase-admin';

export class Messages {
    
    db = admin.firestore();

    async send(email: string,contact: string, msg: string) {
        const docRef = this.db.collection('contact').doc(email);

        const ret = await docRef.get();
        if(ret.exists) {
            const data = ret.data();
            if (data) {
                msg = data.msg + "\n" + msg;
            }
        }

        await docRef.set({
            contact : contact,
            msg: msg
        });

    }

}