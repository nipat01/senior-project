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

  invoiceJob: any = {};
  title: string = "Add Wiki";

  constructor(
    private firebaseService: FirebaseService,
    private db: AngularFireDatabase,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get("id");
    console.log('id', this.id);

    if (this.id) {
      this.title = "Edit wiki";
      this.getWikiByKey(this.id);
    }

  }
  dowloadPDF() {
    var data = document.getElementById('invoice');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('ใบกำกับภาษีอย่างย่อ.pdf'); // Generated PDF
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

}
