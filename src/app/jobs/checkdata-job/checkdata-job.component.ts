import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { DialogModule } from 'primeng/dialog';



@Component({
  selector: 'app-checkdata-job',
  templateUrl: './checkdata-job.component.html',
  styleUrls: ['./checkdata-job.component.css']
})
export class CheckdataJobComponent implements OnInit {
  jobList: AngularFireList<any>
  job: any[];
  job1: any[];

  List: AngularFireList<any>;
  // : any[];
  id;

  // display: boolean = false;

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private dialog: DialogModule) { }


  ngOnInit() {
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log(job)
      this.job = job.filter((data: any) => data.value.status === 'checkdata');
      // this.job = job

    });

    // this.db.list('').snapshotChanges().map(action => {
    //   return action.map(action => ({ key: action.key, value: action.payload.val() }));
    // }).subscribe( => {
    //   console.log()
    //   this. = ;
    // })

  }




  delJob(data) {
    this.firebaseService.removeJob(data.key);
  }
  editJob(data) {
    console.log(data.value);
    const jobData = {
      ...data.value,
      status: 'checkpayment'
    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);
  }





  // showDialog() {
  //   this.display = true;
  // }

}
