import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-pending-job-driver',
  templateUrl: './pending-job-driver.component.html',
  styleUrls: ['./pending-job-driver.component.css']
})
export class PendingJobDriverComponent implements OnInit {
  jobList: AngularFireList<any>
  job: any[];
  job1: any[];

  carList: AngularFireList<any>;
  car: any[];
  id;
  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private auth: AuthService) { }
  ngOnInit() {
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log(job)
      this.job = job.filter((data: any) => data.value.status === 'Pending'
        && data.value.emailDriver === this.auth.username);


    });

    // this.db.list('car').snapshotChanges().map(action => {
    //   return action.map(action => ({ key: action.key, value: action.payload.val() }));
    // }).subscribe(car => {
    //   console.log(car)
    //   this.car = car;
    // })

  }
  delJob(data) {
    this.firebaseService.removeJob(data.key);
  }
  editJob(data) {
    console.log(data.value);
    const jobData = {
      ...data.value,
      status: 'proceed'
    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);
  }


}
