import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LineNotifyService } from 'src/app/services/line-notify.service';
import * as cors from 'cors';

@Component({
  selector: 'app-addjob',
  templateUrl: './addjob.component.html',
  styleUrls: ['./addjob.component.css']
})

export class AddjobComponent implements OnInit {

  ngOnInit() { }
  constructor(private db: AngularFireDatabase,
    private lineNotify: LineNotifyService) { }

  addjob(data: NgForm) {
    console.log(data.value);
    let time = new Date();
    const jobData = {
      ...data.value,
      status: 'checkdata',
      driver: '',
      totalPayment: '',
      deposit: '',
      bill: '',
      billNo: '',
      billImageUrl: '',
      billNoImageUrl: '',
      // review: time.getTime(),

    }
    // from(this.db.list("/job").push(jobData)).pipe(
    //   switchMap(() => {
    //     return this.lineNotify.postMessage('test');
    //   }),
    //   ).subscribe(result => console.log(result));
    this.db.list("/job").push(jobData)

    //
    // this.db.list("/job").push(data.value).child('status').set("waiting");

  }

  // onClick(){
  //   this.lineNotify.postMessage('','test');
  // }

}
