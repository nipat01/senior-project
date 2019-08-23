// import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// นำพารามิเตอร์ที่ส่งเขามาที่ HTTP endpoint ไป Insert เข้าไปใน 
// Realtime Database ที่ path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
    // รับค่า text พารามิเตอร์ที่ส่งเข้ามา
    const original = req.query.text;
    // insert เข้าไปใน Realtime Database แล้วส่ง response
    admin.database().ref('/messages').push({ original: original }).then(snapshot => {
        // รีไดเรค (ด้วย code 303)ไปที่ url ของ Firebase console เพื่อดูข้อมูลที่เพิ่มเข้าไป
        res.redirect(303, snapshot.ref);
    });
});

