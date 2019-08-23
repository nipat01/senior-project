import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notification-job',
  templateUrl: './notification-job.component.html',
  styleUrls: ['./notification-job.component.css']
})
export class NotificationJobComponent implements OnInit {
  jobList: AngularFireList<any>;
  job: any[];
  job1: any[];

  carList: AngularFireList<any>;
  car: any[];
  id;
  selectedDriver = [];
  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log(job)
      this.job = job.filter((data: any) => data.value.status === 'notification');
      // this.job = job

    });

    this.db.list('car').snapshotChanges().map(action => {
      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(car => {
      console.log(car)
      this.car = car;
    })

  }
  delJob(data) {
    this.firebaseService.removeJob(data.key);
  }
  editJob(data, index) {
    console.log(data.value);
    const jobData = {
      ...data.value,
      status: 'Pending',
    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);
  }
  openData(con, ) {
    console.log('showdataDialog', con);
    // console.log(dataOfDailog.key);

    this.modalService.open(con);
  }

}
