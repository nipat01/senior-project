import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-notification-job',
  templateUrl: './notification-job.component.html',
  styleUrls: ['./notification-job.component.css']
})
export class NotificationJobComponent implements OnInit, OnChanges {


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  // jobList: AngularFireList<any>;
  job: any[];
  job1: any[];

  carList: AngularFireList<any>;
  car: any[];
  wikis: any[];
  selectedDriver = [];

  selectedNameDriver = [];
  selectedEmailDriver = [];
  selectedTokenDriver = [];
  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private modalService: NgbModal) { }

  ngOnInit() {

    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log('notification', job)
      this.job = job.filter((data: any) => data.value.status === 'notification');
      // this.job = job

      console.log('checkTime', this.job.length);
      for (let i = 0; i < this.job.length; i++) {
        const jobTime = {
          ...this.job[i],
        }
        let checkStatus = jobTime.value;
        let timeNow = new Date();
        let time = new Date(checkStatus.workDate.year, checkStatus.workDate.month - 1, checkStatus.workDate.day);
        // console.log('time', time, 'timeNow', timeNow);
        // console.log('checkStatus', checkStatus.workDate);
        if (timeNow >= time) {
          let setTime2 = {
            ...checkStatus,
            statusDriver: 'ไม่มีการยืนยัน',
          }
          this.firebaseService.editJob(this.job[i].key, setTime2);
          // console.log('setTime2', setTime2);
          console.log('ไม่มีการยืนยัน');
        }
      }


    });



    // this.db.list('car').snapshotChanges().map(action => {
    //   return action.map(action => ({ key: action.key, value: action.payload.val() }));
    // }).subscribe(car => {
    //   console.log(car)
    //   this.car = car;
    // });

    this.db.list('wikis').snapshotChanges().map(action => {
      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis;
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
  editJobDriver(dataDriver) {
    const jobData = {
      ...dataDriver.value,
      driver: this.selectedNameDriver,
      emailDriver: this.selectedEmailDriver,
      tokenDriver: this.selectedTokenDriver
    }
    this.firebaseService.editJob(dataDriver.key, jobData);

  }

  selectValue(driver) {
    console.log('showValue', driver.target.value.split(","));
    const getDriver = driver.target.value.split(",");
    const driverEmail = getDriver[0];
    const driverFirstname = getDriver[1];
    const tokenDriver = getDriver[2];

    this.selectedEmailDriver = driverEmail;
    this.selectedNameDriver = driverFirstname;
    this.selectedTokenDriver = tokenDriver;
  }

  openDataDriver(con) {
    console.log('showdataDialog', con);
    // console.log(dataOfDailog.key);
    this.modalService.open(con);
  }

  // private checkStatus() {
  //   this.job;
  //   console.log('checkStatus', this.job.length);

  // }


}
