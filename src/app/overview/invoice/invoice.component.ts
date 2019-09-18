import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase-service.service';
import { AngularFireDatabase } from 'angularfire2/database';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  about:any;

  //id
  invoiceJob: any = [];
  title: string = "Add Wiki";
  id;
  constructor(
    private firebaseService: FirebaseService,
    private db: AngularFireDatabase,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {

     const id = this.route.snapshot.paramMap.get("id");
     console.log('id',id);

    if (id) {

      this.title = "Edit wiki";

      this.getWikiByKey(id);
      console.log('invoiceJob',this.invoiceJob)

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





  getWikiByKey(id) {

    this.invoiceJob = this.db.object('job/'+id).snapshotChanges().map(res => {
      console.log('resssss', res.payload.val());
      return res.payload.val();
    });
    console.log('this.invoiceJob', this.invoiceJob);

  }

}
