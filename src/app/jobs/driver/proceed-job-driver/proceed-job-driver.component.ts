import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { AuthService } from '../../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-proceed-job-driver',
  templateUrl: './proceed-job-driver.component.html',
  styleUrls: ['./proceed-job-driver.component.css']
})
export class ProceedJobDriverComponent implements OnInit {
  jobList: AngularFireList<any>
  job: any[];
  wikis: any[];
  job1: any[];

  carList: AngularFireList<any>;
  car: any[];
  id;
  checkSubmitAndDel = [];

  watcher = navigator.geolocation.watchPosition(
    position => {
      let { latitude, longitude } = position.coords;
      console.log({ latitude, longitude })

      this.wikis[0].value = {
        ...this.wikis[0].value,
        currentLat: latitude,
        currentLong: longitude,
      }
      console.log('watch', this.wikis[0].value);

      this.firebaseService.editWiki(this.wikis[0].key, this.wikis[0].value);
    },
    error => {
      console.error(error);
    },
    {
      enableHighAccuracy: true
    }
  );

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    public auth: AuthService,
    private modalService: NgbModal
    // private auth: AuthService
  ) { }
  ngOnInit() {

    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log(job)
      this.job = job.filter((data: any) => data.value.status === 'proceed'
        && data.value.emailDriver === this.auth.username);
      // this.job = job

    });

    this.db.list('wikis').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis.filter((data: any) => data.value.email === this.auth.username);;

    });

    this.db.list('car').snapshotChanges().map(action => {
      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(car => {
      console.log(car)
      this.car = car;
    })

  }

  ngOnDestroy() {
    navigator.geolocation.clearWatch(this.watcher)
  }


  delJob(data) {
    this.firebaseService.removeJob(data.key);
  }

  editJob(data) {
    console.log(data.value);
    let jobData = {
      ...data.value,
      status: 'proceeded',
      statusSendEmail: 'send',
    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);
    jobData = {
      ...jobData,
      statusSendEmail: 'unsend',
    }
    this.firebaseService.editJob(data.key, jobData);
  }

  open(content, value) {
    if (value === 'submit') {
      this.checkSubmitAndDel[0] = "ต้องการยืนยันงานหรือไม่";
      this.checkSubmitAndDel[1] = "ยืนยัน";
    }
    if (value === 'del') {
      this.checkSubmitAndDel[0] = "ต้องการลบการจ้างหรือไม่";
      this.checkSubmitAndDel[1] = "ลบ";
    }
    this.modalService.open(content);
  }


}
