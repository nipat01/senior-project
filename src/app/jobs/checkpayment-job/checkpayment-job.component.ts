import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';


@Component({
  selector: 'app-checkpayment-job',
  templateUrl: './checkpayment-job.component.html',
  styleUrls: ['./checkpayment-job.component.css']
})
export class CheckpaymentJobComponent implements OnInit {
  jobList: AngularFireList<any>
  job: any[];

  carList: AngularFireList<any>;
  wikis: any[];

  car: any[];
  
  selectedNameDriver = [];
  selectedEmailDriver = [];
  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log(job)
      this.job = job.filter((data: any) => data.value.status === 'checkpayment');
    });

    this.db.list('wikis').snapshotChanges().map(action => {
      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis;
    })
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
    console.log('testeditjob');

    console.log(data.value);
    const jobData = {
      ...data.value,
      status: 'notification',
      driver: this.selectedNameDriver[index],
      emailDriver: this.selectedEmailDriver[index],
    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);
  }

  selectValue(driver, index) {
    console.log('showValue', driver.target.value.split(","));
    const getDriver = driver.target.value.split(",");
   const driverEmail = getDriver[0];
   const driverFirstname = getDriver[1];
    
   this.selectedEmailDriver[index] = driverEmail;
   this.selectedNameDriver[index] = driverFirstname;
    console.log('index', index);
    // console.log('data', data);

  }
}
