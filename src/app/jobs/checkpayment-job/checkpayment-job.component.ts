import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkpayment-job',
  templateUrl: './checkpayment-job.component.html',
  styleUrls: ['./checkpayment-job.component.css']
})
export class CheckpaymentJobComponent implements OnInit, OnChanges {

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  jobList: AngularFireList<any>
  job: any[];

  carList: AngularFireList<any>;
  wikis: any[];

  car: any[];

  selectedNameDriver = [];
  selectedEmailDriver = [];
  selectedTokenlDriver = [];
  //car
  selectedCarModel = [];
  selectedCarId = [];


  formBill = new FormGroup({
    deposit: new FormControl(),
    totalPayment: new FormControl(),
  })

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  myObs$: Observable<any>;

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.myObs$ = this.db.list('job').valueChanges();
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
    });
    this.db.list('car').snapshotChanges().map(action => {
      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(car => {
      console.log(car)
      this.car = car;
    })

  }
  editBill(data) {
    console.log('testeditjob');

    // console.log(data.value);
    data.value = {
      ...data.value,


    }
    const billData = data.value
    console.log('billData',billData);
    this.firebaseService.editJob(data.key, billData);
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
      statusDriver: 'รอการยืนยัน',
      driver: this.selectedNameDriver[index],
      emailDriver: this.selectedEmailDriver[index],
      tokenDriver: this.selectedTokenlDriver[index],
      carModel: this.selectedCarModel[index],
      carId: this.selectedCarId[index]

    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);
  }

  selectValue(driver, index) {
    console.log('showValue', driver.target.value.split(","));
    const getDriver = driver.target.value.split(",");
    const driverEmail = getDriver[0];
    const driverFirstname = getDriver[1];
    const driverToken = getDriver[2];

    this.selectedEmailDriver[index] = driverEmail;
    this.selectedNameDriver[index] = driverFirstname;
    this.selectedTokenlDriver[index] = driverToken;
    // console.log('index', index);
    console.log('data', driver.target.value);

  }
  selectCarValue(car, index) {
    console.log('showValue', car.target.value.split(","));
    const getCar = car.target.value.split(",");
    const carModel = getCar[0];
    const carId = getCar[1];
    // const driverToken = getDriver[2];

    this.selectedCarModel[index] = carModel;
    this.selectedCarId[index] = carId;
    // this.selectedTokenlDriver[index] = driverToken;
    // console.log('index', index);
    console.log('data', car.target.value);

  }
  openBill(content) {
    this.modalService.open(content);
  }
  openData(con, ) {
    console.log('showdataDialog', con);
    // console.log(dataOfDailog.key);
    this.modalService.open(con);
  }
}
