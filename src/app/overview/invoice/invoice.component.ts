import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase-service.service';
import { AngularFireDatabase } from 'angularfire2/database';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AngularFireObject, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  about: any;

  id
  timeNow;
  dateNow;

  times;
  invoiceJob: any = {};
  title: string = "Add Wiki";
  token: any[];
  constructor(
    private firebaseService: FirebaseService,
    private db: AngularFireDatabase,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get("id");
    console.log('id', this.id);
    if (this.id) {
      this.getWikiByKey(this.id);
    }

    this.db.list('allhomepage/about').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(about => {
      console.log(about)
      this.about = about;
    });

    this.db.list('token').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(token => {
      // console.log('token', token[0].value)
      this.token = token;


    });


    this.timeThai();


  }
  dowloadPDF() {
    var data = document.getElementById('invoice');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      // var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      console.log('canvas', canvas.height, imgHeight);

      // var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      // imgHeight

      pdf.save('ใบกำกับภาษี.pdf'); // Generated PDF
      window.open(pdf.output('bloburl', { filename: 'ใบกำกับภาษี.pdf' }), '_blank');
    });
  }





  // getWikiByKey(id) {
  //   this.invoiceJob = this.db.object('job/' + id).snapshotChanges().map(res => {
  //     console.log('resssss', this.invoiceJob)
  //     return res.payload.val();
  //   });
  // }

  getWikiByKey(id) {
    this.firebaseService.getWiki(id).subscribe((data) => {
      this.invoiceJob = data;
      console.log('invoiceJob', this.invoiceJob)
    });
  }

  timeThai() {
    this.timeNow = new Date();
    this.dateNow = new Date();
    this.dateNow = this.formatDate(this.dateNow);

    let thday = new Array("อาทิตย์", "จันทร์",
      "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์");
    let thmonth = new Array("มกราคม", "กุมภาพันธ์", "มีนาคม",
      "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน",
      "ตุลาคม", "พฤศจิกายน", "ธันวาคม");

    console.log("วัน" + thday[this.timeNow.getDay()] + "ที่ " + this.timeNow.getDate() + " " +
      thmonth[this.timeNow.getMonth()] + " " + (0 + this.timeNow.getYear() + 2443));
    this.timeNow = "วัน" + thday[this.timeNow.getDay()] + "ที่ " + this.timeNow.getDate() + " " +
      thmonth[this.timeNow.getMonth()] + " พ.ศ. " + (0 + this.timeNow.getYear() + 2443)

    this.myFunction()

  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }



  myFunction() {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let hours = h < 10 ? "0" + h : h;
    let minutes = m < 10 ? "0" + m : m;


    this.times = `${hours}:${minutes} `
    // this.times = `${hours}:${minutes} น. `

  }



}
