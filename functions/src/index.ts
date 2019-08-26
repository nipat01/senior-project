// import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//function 2222222222222222
// const functions = require('firebase-functions');

// const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
// // นำพารามิเตอร์ที่ส่งเขามาที่ HTTP endpoint ไป Insert เข้าไปใน 
// // Realtime Database ที่ path /messages/:pushId/original
// exports.addMessage = functions.https.onRequest((req:any, res:any) => {
//     // รับค่า text พารามิเตอร์ที่ส่งเข้ามา
//     const original = req.query.text;
//     console.log(req.query);
//     // insert เข้าไปใน Realtime Database แล้วส่ง response
//     admin.database().ref('/messages').push({ original: original }).then((snapshot:any) => {
//         // รีไดเรค (ด้วย code 303)ไปที่ url ของ Firebase console เพื่อดูข้อมูลที่เพิ่มเข้าไป
//         res.redirect(303, snapshot.ref);
//     });

// });


//function 333333333333333333

'use strict';

const functions = require('firebase-functions');
const request = require('request-promise');

const lineNotify = (lineMessage: any) => {
    const notifyResponse =  request({
        method: `POST`,
        uri: `https://notify-api.line.me/api/notify`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer UdN7DKK1OisfMWOEQaQsmtTTvspqFsGe7igVjKqxgR0'
        },
        form: {
            message: lineMessage,
        }
    })

    console.log(notifyResponse);

    return notifyResponse;
    
};


exports.postNotifyToLine = functions.database.ref('/job')
    .onCreate( (snapshot: any, context: any) => {
        // .onCreate((snapshot, context) => {
        const original = snapshot.val();
        return  lineNotify(original);
        console.log(`Posted regressed issue successfully to Slack`);


    });





// exports.postOnNewIssue = functions.crashlytics.issue().onNew((issue) => {
//     console.info('postOnNewIssue', issue.issueTitle);
//     const issueId = issue.issueId;
//     const issueTitle = issue.issueTitle;
//     const appName = issue.appInfo.appName;
//     const appPlatform = issue.appInfo.appPlatform;
//     const latestAppVersion = issue.appInfo.latestAppVersion;

//     const lineMessage = `There is a new issue - ${issueTitle} ${functions.config().crashlytics.url}${issueId} ` + `in ${appName}, version ${latestAppVersion} on ${appPlatform}`;

//     return notifyLine(lineMessage, 2, 34).then(() => {
//         console.log(`Posted new issue ${issueId} successfully to Slack`);
//         return issueId;
//     });
// });

// exports.postOnRegressedIssue = functions.crashlytics.issue().onRegressed((issue) => {
//     console.info('postOnRegressedIssue', issue.issueTitle);
//     const issueId = issue.issueId;
//     const issueTitle = issue.issueTitle;
//     const appName = issue.appInfo.appName;
//     const appPlatform = issue.appInfo.appPlatform;
//     const latestAppVersion = issue.appInfo.latestAppVersion;
//     const resolvedTime = issue.resolvedTime;

//     const lineMessage = `There is a regressed issue ${issueTitle} ${functions.config().crashlytics.url}${issueId} ` + `in ${appName}, version ${latestAppVersion} on ${appPlatform}. This issue was previously ` + `resolved at ${new Date(resolvedTime).toString()}`;

//     return notifyLine(lineMessage, 1, 15).then(() => {
//         console.log(`Posted regressed issue ${issueId} successfully to Slack`);
//         return issueId;
//     });
// });

// exports.postOnVelocityAlertIssue = functions.crashlytics.issue().onVelocityAlert((issue) => {
//     console.info('postOnVelocityAlertIssue', issue.issueTitle);
//     const issueId = issue.issueId;
//     const issueTitle = issue.issueTitle;
//     const appName = issue.appInfo.appName;
//     const appPlatform = issue.appInfo.appPlatform;
//     const latestAppVersion = issue.appInfo.latestAppVersion;
//     const crashPercentage = issue.velocityAlert.crashPercentage;

//     const lineMessage = `There is an issue ${issueTitle} ${functions.config().crashlytics.url}${issueId} ` + `in ${appName}, version ${latestAppVersion} on ${appPlatform} that is causing ` + `${parseFloat(crashPercentage).toFixed(2)}% of all sessions to crash.`;

//     return notifyLine(lineMessage, 2, 24).then(() => {
//         console.log(`Posted velocity alert ${issueId} successfully to Slack`);
//         return issueId;
//     });
// });