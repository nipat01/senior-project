'use strict';
const functions = require('firebase-functions');
const request = require('request-promise');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();
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


// 1-------------------------------------------------------------------------------------------
const lineNotify = (lineMessage: any, token: any) => {
  // const token = 'UdN7DKK1OisfMWOEQaQsmtTTvspqFsGe7igVjKqxgR0'; //ใส่ access token ที่ใช้งาน
  const options = {
    "method": 'POST',
    "uri": `https://notify-api.line.me/api/notify`,
    "headers": {
      'Content-Type': 'application/x-www-form-urlencoded',
      "Authorization": `Bearer ${token}`
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
         วันที่:${original.workDate}
         เวลา:${original.timeHour}:00 น.
         ชื่อ:${original.customerFirstname}
         อีเมล:${original.customerLine}
         เบอร์โทรศัพท์:${original.customerPhone}
         ประเภท:${original.worktype}
         ต้นทาง:${original.source} ${original.subDistictSource} ${original.distictSource} ${original.provinceSource}
         ปลายทาง:${original.destination} ${original.subDistictDestination} ${original.distictDestination} ${original.provinceDestination}
    `

    return lineNotify(dataOiginal, original.token);
  });
//2--------------------------------------------------------------------------------------
const notifyToDriver = (lineMessage: any, token: any) => {
  // const token = '7y9LzqXlYOfsxIBY1hNAeFpmvd9qr1qLbMXkroeQNIr';
  const options = {
    "method": 'POST',
    "uri": `https://notify-api.line.me/api/notify`,
    "headers": {
      'Content-Type': 'application/x-www-form-urlencoded',
      "Authorization": `Bearer ${token} `
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

exports.updateDriver = functions.database.ref('/job/{pushId}')
  .onUpdate((change: any, context: any) => {
    const afterData = change.after.val(); // data after the write
    console.log(afterData);
    // const token = afterData.token  token=admin,tokenDriver=driver

    if (afterData.driver !== ''
      && afterData.status === 'notification'
      && afterData.statusDelete !== 'delete'
      && afterData.statusSendEmail === 'send') {  // return notifyToDriver(afterData,);
      const dataOiginal = `แจ้งเตือนงานDriver
    วันที่:${afterData.workDate}
    เวลา:${afterData.timeHour}:00 น.
    ชื่อ:${afterData.customerFirstname}
    เบอร์โทรศัพท์:${afterData.customerPhone}
    ประเภท:${afterData.worktype}
    ต้นทาง:${afterData.source} ${afterData.subDistictSource} ${afterData.distictSource} ${afterData.provinceSource}
    ปลายทาง:${afterData.destination} ${afterData.subDistictDestination} ${afterData.distictDestination} ${afterData.provinceDestination}
    `

      return notifyToDriver(dataOiginal, afterData.tokenDriver);
    }
    else if (afterData.driver !== ''
      && afterData.status === 'Pending'
      && afterData.statusDelete !== 'delete'
      && afterData.statusSendEmail === 'send') {
      const dataOiginal = `
      ${afterData.driver} ยืนยันคำสั่งจ้างของ
      คุณ:${afterData.customerFirstname}
      อีเมล:${afterData.customerLine}
      เบอร์โทรศัพท์:${afterData.customerPhone}
      วันที่:${afterData.workDate}
      เวลา:${afterData.timeHour}:00 น.
      ประเภท:${afterData.worktype}
      ต้นทาง:${afterData.source} ${afterData.subDistictSource} ${afterData.distictSource} ${afterData.provinceSource}
    ปลายทาง:${afterData.destination} ${afterData.subDistictDestination} ${afterData.distictDestination} ${afterData.provinceDestination}
    `

      return notifyToDriver(dataOiginal, afterData.token);
    }

    else if (afterData.driver !== ''
      && afterData.status === 'proceed'
      && afterData.statusDelete !== 'delete'
      && afterData.statusSendEmail === 'send') {
      const dataOiginal = `
    ${afterData.driver} เริ่มปฏิบัติงานของ
    คุณ:${afterData.customerFirstname}
    อีเมล:${afterData.customerLine}
    เบอร์โทรศัพท์:${afterData.customerPhone}
    ประเภท:${afterData.worktype}
    วันที่:${afterData.workDate}
    เวลา:${afterData.timeHour}:00 น.
    ต้นทาง:${afterData.source} ${afterData.subDistictSource} ${afterData.distictSource} ${afterData.provinceSource}
    ปลายทาง:${afterData.destination} ${afterData.subDistictDestination} ${afterData.distictDestination} ${afterData.provinceDestination}
    `

      return notifyToDriver(dataOiginal, afterData.token);
    }
  });




//3------------------------------------------------------------------------------------------
const notifyToGroupDriver = (lineMessage: any, token: any) => {
  // const token = 'IAIHa96melOHxtzsG0qyIVtyBGnu9iH92gj65NKGLNG'; //ใส่ access token ที่ใช้งาน
  const options = {
    "method": 'POST',
    "uri": `https://notify-api.line.me/api/notify`,
    "headers": {
      'Content-Type': 'application/x-www-form-urlencoded',
      "Authorization": `Bearer ${token}`
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

exports.updateGroupDriver = functions.database.ref('/wikis/{pushId}')
  .onWrite((change: any, context: any) => {
    const afterData = change.after.val(); // data after the write
    console.log(afterData);
    const token = afterData.token
    if (afterData.sendCoordinates === 'send!') {
      const sendNotify = `กรุณาส่งตำแหน่งปัจจุบัน`
      return notifyToGroupDriver(sendNotify, token);
    }
  });



// 0 7-16 * * 1-5
// */5 * * * 1-5
// 4-----------------------------------------------------------------------------------
exports.cronjob = functions.pubsub.schedule("0 7-16 * * 1-5").timeZone('Asia/Bangkok').onRun((context: any) => {

  let conncetRTDB = admin.database().ref("job");
  conncetRTDB.on("child_added", function (snapshot: any) {
    // console.log('snapshot', snapshot.val());
    const snapshotChange = snapshot.val();
    // const timeNow = new Date();

    const asiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
    const timeNow = new Date(asiaTime);

    const thisDay = timeNow.getDate();
    const thisMonth = timeNow.getMonth();
    const thisYear = timeNow.getFullYear();
    const thisHour = timeNow.getHours();
    // console.log('timeNow', thisDay, thisMonth, thisYear, thisHour);
    const timeJob = snapshotChange.workDate.split('/');

    if (snapshotChange.status === 'Pending') {
      if (thisDay === +timeJob[0]
        && thisMonth + 1 === +timeJob[1]
        && thisYear === +timeJob[2]) {
        if (thisHour + 1 === snapshotChange.timeHour) {
          //+8 เพราะว่า +1 สำหรับเผื่อเวลา1ชม +7 เพิ่มเป็นของอเมริกา
          const notifyTimeComeDriver = `
        วันที่:${snapshotChange.workDate}
        เวลา:${snapshotChange.timeHour}:00 น.
        มีงานของคุณ ${snapshotChange.customerFirstname}
        ประเภท:${snapshotChange.worktype}
        เบอร์โทรศัพท์:${snapshotChange.customerPhone}
        ต้นทาง:${snapshotChange.source} ${snapshotChange.subDistictSource} ${snapshotChange.distictSource} ${snapshotChange.provinceSource}
        ปลายทาง:${snapshotChange.destination} ${snapshotChange.subDistictDestination} ${snapshotChange.distictDestination} ${snapshotChange.provinceDestination}
        `

          const notifyTimeComeAdmin = `
          วันที่:${snapshotChange.workDate}
          เวลา:${snapshotChange.timeHour}:00 น.
          พนักงานชื่อ: ${snapshotChange.driver}
          มีงานของคุณ ${snapshotChange.customerFirstname}
          ประเภท:${snapshotChange.worktype}
          เบอร์โทรศัพท์:${snapshotChange.customerPhone}
          ต้นทาง:${snapshotChange.source} ${snapshotChange.subDistictSource} ${snapshotChange.distictSource} ${snapshotChange.provinceSource}
          ปลายทาง:${snapshotChange.destination} ${snapshotChange.subDistictDestination} ${snapshotChange.distictDestination} ${snapshotChange.provinceDestination}
        `
          return notifyToDriver(notifyTimeComeDriver, snapshotChange.tokenDriver).then(lineNotify(notifyTimeComeAdmin, snapshotChange.token))
        }
      }
    }

    if (snapshotChange.status === 'Pending') {
      if (thisDay === +timeJob[0]
        && thisMonth + 1 === +timeJob[1]
        && thisYear === +timeJob[2]) {
        if (thisHour === snapshotChange.timeHour) {
          //+8 เพราะว่า +1 สำหรับเผื่อเวลา1ชม +7 เพิ่มเป็นของอเมริกา
          const notifyTimeComeDriver = `
          วันที่:${snapshotChange.workDate}
          เวลา:${snapshotChange.timeHour}:00 น.
          คุณไม่ได้กดเริ่มงาน
          ของคุณ ${snapshotChange.customerFirstname}
          เบอร์โทรศัพท์:${snapshotChange.customerPhone}
          ประเภท:${snapshotChange.worktype}
          ต้นทาง:${snapshotChange.source} ${snapshotChange.subDistictSource} ${snapshotChange.distictSource} ${snapshotChange.provinceSource}
          ปลายทาง:${snapshotChange.destination} ${snapshotChange.subDistictDestination} ${snapshotChange.distictDestination} ${snapshotChange.provinceDestination}
        `

          const notifyTimeComeAdmin = `
          วันที่:${snapshotChange.workDate}
          เวลา:${snapshotChange.timeHour}:00 น.
          ${snapshotChange.driver} ไม่ได้กดเริ่มงานของ
          คุณ ${snapshotChange.customerFirstname}
          เบอร์โทรศัพท์:${snapshotChange.customerPhone}
          ประเภท:${snapshotChange.worktype}
          ต้นทาง:${snapshotChange.source} ${snapshotChange.subDistictSource} ${snapshotChange.distictSource} ${snapshotChange.provinceSource}
          ปลายทาง:${snapshotChange.destination} ${snapshotChange.subDistictDestination} ${snapshotChange.distictDestination} ${snapshotChange.provinceDestination}
          `
          return notifyToDriver(notifyTimeComeDriver, snapshotChange.tokenDriver).then(lineNotify(notifyTimeComeAdmin, snapshotChange.token))
        }
      }
    }

    if (snapshotChange.status === 'notification') {
      if (thisDay === +timeJob[0]
        && thisMonth + 1 === +timeJob[1]
        && thisYear === +timeJob[2]) {
        if (thisHour + 2 === snapshotChange.timeHour) {
          //+8 เพราะว่า +1 สำหรับเผื่อเวลา1ชม +7 เพิ่มเป็นของอเมริกา
          const notifyTimeComeAdmin = `
          วันที่:${snapshotChange.workDate}
          เวลา:${snapshotChange.timeHour}:00 น.
          ${snapshotChange.driver} ยังไม่กดยืนยันคำสั่งจ้างของ
          คุณ:${snapshotChange.customerFirstname}
          เบอร์โทรศัพท์:${snapshotChange.customerPhone}
          ประเภท:${snapshotChange.worktype}
          ต้นทาง:${snapshotChange.source} ${snapshotChange.subDistictSource} ${snapshotChange.distictSource} ${snapshotChange.provinceSource}
          ปลายทาง:${snapshotChange.destination} ${snapshotChange.subDistictDestination} ${snapshotChange.distictDestination} ${snapshotChange.provinceDestination}
          `

          // const notifyTimeComeAdmin = `เวลา:${snapshotChange.timeHour}:00 น.
          // พนักงานชื่อ: ${snapshotChange.driver}
          // มีงานของคุณ ${snapshotChange.customerFirstname}
          // อีเมล:${snapshotChange.customerLine}
          // เบอร์โทรศัพท์:${snapshotChange.customerPhone}
          // ต้นทาง:${snapshotChange.source}
          // ปลายทาง:${snapshotChange.destination}
          // รายละเอียดการจ้างงาน:${snapshotChange.detail}
          // ประเภท:${snapshotChange.worktype}`
          return lineNotify(notifyTimeComeAdmin, snapshotChange.token)
        }
      }
    }
  })

});


// send email------------------------------------------------------------------------------------
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'nipat1612@gmail.com',
    pass: 'pp0820129493'
  }
});


exports.sendEmail = functions.database.ref('/job/{pushId}')
  .onWrite((snapshot: any, context: any) => {
    // .onCreate((snapshot, context) => {
    var dataHtml;
    const original = snapshot.after.val();
    console.log(original);

    if (original.status === 'checkdata' && original.statusSendEmail === 'send') {
      dataHtml = `<h1>Order Confirmation</h1>
      <p>
          คำสั่งจ้างของท่าน ได้ส่งเข้าระบบเรียบร้อยแล้ว
         <br>
         ชื่อ:${original.customerFirstname}<br>
         เบอร์โทรศัพท์:${original.customerPhone}<br>
         วันที่:${original.workDate} <br>
         เวลา:${original.timeHour} :00 น. <br>
         ประเภท:${original.worktype} <br><br>
         ต้นทาง:${original.source}  ${original.subDistictSource} ${original.distictSource} ${original.provinceSource} <br>
         ปลายทาง:${original.destination} ${original.subDistictDestination} ${original.distictDestination} ${original.provinceDestination}<br>
         ท่านสามารถเช็คสถานะการทำงานได้จาก
         <a href="https://jistigdatabase.web.app/checkstatus/${original.time}">JISTIC</a>
      </p>`


      if (original.invoiceNo) {

        dataHtml = `<h1>Order Confirmation</h1>
      <p>
          คำสั่งจ้างของท่าน ได้ส่งเข้าระบบเรียบร้อยแล้ว
         <br>
         ชื่อ:${original.customerFirstname}<br>
         เบอร์โทรศัพท์:${original.customerPhone}<br>
         วันที่:${original.workDate} <br>
         เวลา:${original.timeHour} :00 น. <br>
         ประเภท:${original.worktype} <br>
         ต้นทาง:${original.source}  ${original.subDistictSource} ${original.distictSource} ${original.provinceSource} <br>
         ปลายทาง:${original.destination} ${original.subDistictDestination} ${original.distictDestination} ${original.provinceDestination}<br><br>

         ข้อมูลผู้เสียภาษี <br>
         ชื่อผู้เสียภาษี:${original.nameForInvoice} <br>
         เลขประจำตัวผู้เสียภาษี:${original.invoiceNo}<br>
         ที่อยู่:${original.addressForInvoice}<br>
         เบอร์ติดต่อ: ${original.customerPhoneForInvoice}<br><br>

         ท่านสามารถเช็คสถานะการทำงานได้จาก
         <a href="https://jistigdatabase.web.app/checkstatus/${original.time}">JISTIC</a>
      </p>`

        // dataInvoice = `ข้อมูลผู้เสียภาษี <br>
        // ชื่อลูกค้า:${original.nameForInvoice} <br>
        // เลขประจำตัวผู้เสียภาษี:${original.invoiceNo}<br>
        // ที่อยู่:${original.addressForInvoice}<br>
        // เบอร์ติดต่อ: ${original.customerPhoneForInvoice}<br>`
      }

      const mailOptions = {
        from: `***********`,
        to: original.customerLine,
        subject: `Jistic: ข้อมูลคำสั่งจ้าง รหัส${original.time}`,
        html: dataHtml
      };
      return transporter.sendMail(mailOptions, (error: any, data: any) => {
        if (error) {
          console.log(error)
          return
        }
        console.log("Sent!")
      });
    }
    //email
    else if (original.status === 'notification' && original.statusSendEmail === 'send') {
      dataHtml = `<p>
      ระบบได้รับการชำระค่ามัดจำเรียบร้อยของแล้ว
      <br>
      ยอดคงค้างที่ต้องชำระคือ ${original.totalPayment - original.deposit} บาท <br>
      รายละเอียดงาน<br>
      คุณ:${original.customerFirstname}<br>
      เบอร์โทรศัพท์:${original.customerPhone}<br>
      วันที่:${original.workDate}<br>
      เวลา:${original.timeHour}:00 น. <br>
      ประเภท:${original.worktype} <br>
      ต้นทาง:${original.source}  ${original.subDistictSource} ${original.distictSource} ${original.provinceSource} <br>
      ปลายทาง:${original.destination} ${original.subDistictDestination} ${original.distictDestination} ${original.provinceDestination}<br><br>


      ท่านสามารถเช็คสถานะการทำงานได้จาก<br>
      <a href="https://jistigdatabase.web.app/checkstatus/${original.time}">JISTIC</a>
   </p>`

      if (original.invoiceNo) {

        dataHtml = `<p>
        ระบบได้รับการชำระค่ามัดจำเรียบร้อยของแล้ว
        <br>
        ยอดคงค้างที่ต้องชำระคือ ${original.totalPayment - original.deposit} บาท
        รายละเอียดงาน<br>
        คุณ:${original.customerFirstname}<br>
        เบอร์โทรศัพท์:${original.customerPhone}<br>
        วันที่:${original.workDate}<br>
        เวลา:${original.timeHour}:00 น. <br>
        ประเภท:${original.worktype} <br>
        ต้นทาง:${original.source}  ${original.subDistictSource} ${original.distictSource} ${original.provinceSource} <br>
        ปลายทาง:${original.destination} ${original.subDistictDestination} ${original.distictDestination} ${original.provinceDestination}<br><br>

        ข้อมูลผู้เสียภาษี <br>
        ชื่อผู้เสียภาษี:${original.nameForInvoice} <br>
        เลขประจำตัวผู้เสียภาษี:${original.invoiceNo}<br>
        ที่อยู่:${original.addressForInvoice}<br>
        เบอร์ติดต่อ: ${original.customerPhoneForInvoice}<br><br>

        ท่านสามารถเช็คสถานะการทำงานได้จาก<br>
        <a href="https://jistigdatabase.web.app/checkstatus/${original.time}">JISTIC</a>
     </p>`

      }
      const mailOptions = {
        from: `***********`,
        to: original.customerLine,
        subject: `Jistic: ข้อมูลคำสั่งจ้าง รหัส${original.time}`,
        html: dataHtml
      };
      return transporter.sendMail(mailOptions, (error: any, data: any) => {
        if (error) {
          console.log(error)
          return
        }
        console.log("Sent!")
      });
    }

    else if (original.status === 'proceed' && original.statusSendEmail === 'send') {
      dataHtml = `<p>
      ขณะนี้พนักงานกำลังไปยังต้นทางของท่าน
      <br>

      รายละเอียดงาน<br>
      คุณ:${original.customerFirstname}<br>
      เบอร์โทรศัพท์:${original.customerPhone}<br>
      วันที่:${original.workDate}<br>
      เวลา:${original.timeHour}:00 น. <br>
      ประเภท:${original.worktype} <br>
      ต้นทาง:${original.source}  ${original.subDistictSource} ${original.distictSource} ${original.provinceSource} <br>
      ปลายทาง:${original.destination} ${original.subDistictDestination} ${original.distictDestination} ${original.provinceDestination}<br>
      ชื่อพนักงานขับรถ: ${original.driver}<br><br>

      ท่านสามารถเช็คสถานะการทำงาน และ ตำแหน่งปัจจุบันของพนักงานขับรถได้จาก<br>
      <a href="https://jistigdatabase.web.app/checkstatus/${original.time}">JISTIC</a>
   </p>`

      if (original.invoiceNo) {

        dataHtml = `<p>
      <b> ขณะนี้พนักงานกำลังไปยังต้นทางของท่าน
      <br>

      รายละเอียดงาน
      คุณ:${original.customerFirstname}<br>
      เบอร์โทรศัพท์:${original.customerPhone}<br>
      วันที่:${original.workDate}<br>
      เวลา:${original.timeHour}:00 น. <br>
      ประเภท:${original.worktype} <br>
      ต้นทาง:${original.source}  ${original.subDistictSource} ${original.distictSource} ${original.provinceSource} <br>
      ปลายทาง:${original.destination} ${original.subDistictDestination} ${original.distictDestination} ${original.provinceDestination}<br>
      ชื่อพนักงานขับรถ: ${original.driver}<br><br>
      ข้อมูลผู้เสียภาษี <br>
      ชื่อผู้เสียภาษี:${original.nameForInvoice} <br>
      เลขประจำตัวผู้เสียภาษี:${original.invoiceNo}<br>
      ที่อยู่:${original.addressForInvoice}<br>
      เบอร์ติดต่อ: ${original.customerPhoneForInvoice}<br><br>

      ท่านสามารถเช็คสถานะการทำงาน และ ตำแหน่งปัจจุบันของพนักงานขับรถได้จาก<br>
      <a href="https://jistigdatabase.web.app/checkstatus/${original.time}">JISTIC</a>
   </p>`

      }

      const mailOptions = {
        from: `***********`,
        to: original.customerLine,
        subject: `Jistic: ข้อมูลคำสั่งจ้าง รหัส${original.time}`,
        html: dataHtml
      };
      return transporter.sendMail(mailOptions, (error: any, data: any) => {
        if (error) {
          console.log(error)
          return
        }
        console.log("Sent!")
      });
    }

    else if (original.status === 'proceeded' && original.statusSendEmail === 'send'
      // && !original.billNoFilePath
      // && !original.billNoImageUrl
      // && !original.billNoFilePath
      // && !original.billImageUrl
      // && !original.bill
      // && !original.billNo
      // && original.statusDelete !== 'delete'
    ) {

      dataHtml = `<p>
      บริษัทดำเนินงานของท่านเรียบร้อยแล้ว ขอบคุณที่ใช้บริการของเรา
      <br>

      รายละเอียดงาน<br>
      คุณ:${original.customerFirstname}<br>
      เบอร์โทรศัพท์:${original.customerPhone}<br>
      วันที่:${original.workDate}<br>
      เวลา:${original.timeHour}:00 น. <br>
      ประเภท:${original.worktype} <br>
      ต้นทาง:${original.source}  ${original.subDistictSource} ${original.distictSource} ${original.provinceSource} <br>
      ปลายทาง:${original.destination} ${original.subDistictDestination} ${original.distictDestination} ${original.provinceDestination}<br>
      ชื่อพนักงานขับรถ: ${original.driver}<br><br>

      กรุณาประเมินความพึงพอใจของบริการของเราด้วยค่ะ<br>
      <a href="https://jistigdatabase.web.app/checkstatus/${original.time}">JISTIC</a>
   </p>`

      if (original.invoiceNo) {

        dataHtml = `<p>
  บริษัทดำเนินงานของท่านเรียบร้อยแล้ว ขอบคุณที่ใช้บริการของเรา
  <br>

  รายละเอียดงาน
  คุณ:${original.customerFirstname}<br>
  เบอร์โทรศัพท์:${original.customerPhone}<br>
  วันที่:${original.workDate}<br>
  เวลา:${original.timeHour}:00 น. <br>
  ประเภท:${original.worktype} <br>
  ต้นทาง:${original.source}  ${original.subDistictSource} ${original.distictSource} ${original.provinceSource} <br>
  ปลายทาง:${original.destination} ${original.subDistictDestination} ${original.distictDestination} ${original.provinceDestination}<br>
  ชื่อพนักงานขับรถ: ${original.driver}<br><br>
  ข้อมูลผู้เสียภาษี <br>
  ชื่อผู้เสียภาษี:${original.nameForInvoice} <br>
  เลขประจำตัวผู้เสียภาษี:${original.invoiceNo}<br>
  ที่อยู่:${original.addressForInvoice}<br>
  เบอร์ติดต่อ: ${original.customerPhoneForInvoice}<br><br>

  กรุณาประเมินความพึงพอใจของบริการของเราด้วยค่ะ<br>
  <a href="https://jistigdatabase.web.app/checkstatus/${original.time}">JISTIC</a>
</p>`

      }

      const mailOptions = {
        from: `***********`,
        to: original.customerLine,
        subject: `Jistic: ข้อมูลคำสั่งจ้าง รหัส${original.time}`,
        html: dataHtml
      };
      return transporter.sendMail(mailOptions, (error: any, data: any) => {
        if (error) {
          console.log(error)
          return
        }
        console.log("Sent!")
      });
    }

  });



