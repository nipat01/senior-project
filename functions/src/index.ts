
'use strict';

const functions = require('firebase-functions');
const request = require('request-promise');
// const request = require('request')
// const lineNotify = (lineMessage: any) => {
//     const options = {
//         method: `POST`,
//         uri: `https://notify-api.line.me/api/notify`,
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Authorization': 'Bearer UdN7DKK1OisfMWOEQaQsmtTTvspqFsGe7igVjKqxgR0'
//         },
//         form: {
//             message: lineMessage,
//         }
//     }
//     console.log('optionsจ้า', { options })
//     return request(options).then((notifyResponse: any) => {
//         console.log('notifyResponseจ้า', { notifyResponse })
//         return notifyResponse
//     }).catch((err: any) => {
//         console.log('erorจ้า', { err })
//     })

// };

const lineNotify = (lineMessage: any) => {
  const token = 'UdN7DKK1OisfMWOEQaQsmtTTvspqFsGe7igVjKqxgR0'; //ใส่ access token ที่ใช้งาน
  const options = {
    "method": 'POST',
    "uri": `https://notify-api.line.me/api/notify`,
    "headers": {
      'Content-Type': 'application/x-www-form-urlencoded',
      "Authorization": "Bearer " + token
    },
    // "payload": 'message=' + lineMessage,

    form: {
      message: lineMessage,
    }
  };
  return request(options).then((notifyResponse: any) => {
    console.log('notifyResponseจ้า', { notifyResponse })
    return notifyResponse
  }).catch((err: any) => {
    console.log('erorจ้า', { err })
  })
}

exports.postNotifyToLine = functions.database.ref('/job/{pushId}')
  .onCreate((snapshot: any, context: any) => {
    // .onCreate((snapshot, context) => {
    const original = snapshot.val();
    console.log(original);
    const dataOiginal = `แจ้งเตือนงาน
         ชื่อ:${original.customerFirstname}
         ไลน์:${original.customerLine}
         เบอร์โทรศัพท์:${original.customerPhone}
         ต้นทาง:${original.source}
         ปลายทาง:${original.destination}
         รายละเอียดการจ้างงาน:${original.detail}
         วัน:${original.workDate}
         เวลา:${original.workTime}
         ประเภท:${original.worktype}`

    return lineNotify(dataOiginal);
  });

const notifyToDriver = (lineMessage: any) => {
  const token = '7y9LzqXlYOfsxIBY1hNAeFpmvd9qr1qLbMXkroeQNIr'; //ใส่ access token ที่ใช้งาน
  const options = {
    "method": 'POST',
    "uri": `https://notify-api.line.me/api/notify`,
    "headers": {
      'Content-Type': 'application/x-www-form-urlencoded',
      "Authorization": "Bearer " + token
    },
    // "payload": 'message=' + lineMessage,

    form: {
      message: lineMessage,
    }
  };
  return request(options).then((notifyResponse: any) => {
    console.log('notifyResponseจ้า', { notifyResponse })
    return notifyResponse
  }).catch((err: any) => {
    console.log('erorจ้า', { err })
  })
}
exports.updateDriver = functions.database.ref('/job/{pushId}/driver')
  .onWrite((change: any, context: any) => {
    const afterData = change.after.val(); // data after the write
    console.log(afterData);
    return notifyToDriver(afterData);
  });





const notifyToGroupDriver = (lineMessage: any) => {
  const token = 'IAIHa96melOHxtzsG0qyIVtyBGnu9iH92gj65NKGLNG'; //ใส่ access token ที่ใช้งาน
  const options = {
    "method": 'POST',
    "uri": `https://notify-api.line.me/api/notify`,
    "headers": {
      'Content-Type': 'application/x-www-form-urlencoded',
      "Authorization": "Bearer " + token
    },
    // "payload": 'message=' + lineMessage,

    form: {
      message: lineMessage,
    }
  };
  return request(options).then((notifyResponse: any) => {
    console.log('notifyResponseจ้า', { notifyResponse })
    return notifyResponse
  }).catch((err: any) => {
    console.log('erorจ้า', { err })
  })
}

exports.updateGroupDriver = functions.database.ref('/wikis/{pushId}/currentLat')
  .onWrite((change: any, context: any) => {
    const afterData = change.after.val(); // data after the write
    console.log(afterData);
    const sendNotify = `กรุณาส่งตำแหน่งปัจจุบัน`
    return notifyToGroupDriver(sendNotify);
  });




