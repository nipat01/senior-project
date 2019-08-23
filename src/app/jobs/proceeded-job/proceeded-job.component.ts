import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-proceeded-job',
  templateUrl: './proceeded-job.component.html',
  styleUrls: ['./proceeded-job.component.css']
})
export class ProceededJobComponent implements OnInit {
  jobList: AngularFireList<any>
  job: any[];
  job1: any[];

  carList: AngularFireList<any>;
  car: any[];
  id;
  constructor(private db: AngularFireDatabase,
              private firebaseService: FirebaseService,
              private route: ActivatedRoute,
              config: NgbModalConfig, private modalService: NgbModal
              ) {
                config.backdrop = 'static';
                config.keyboard = false;
              }

  ngOnInit() {
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log(job)
      this.job = job.filter((data: any) => data.value.status === 'proceeded');
      // this.job = job

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
      status: 'proceeded'
    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);
  }

  open(content) {
    this.modalService.open(content);
  }

  openData(con) {
    this.modalService.open(con);
  }

  openReview(review) {
    this.modalService.open(review);
  }

}
