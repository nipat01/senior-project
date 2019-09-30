import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-search-job',
  templateUrl: './search-job.component.html',
  styleUrls: ['./search-job.component.css']
})
export class SearchJobComponent implements OnInit, OnChanges {


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  job: any[];
  job2: any[];


  wikis: any[];

  car: any[];

  // searchSelectValue = []; ไม่ได้ใช้มั้ง

  //checkValue
  checkSelect;
  checkCustomer = true;
  checkDriver;
  checkStatusJob;
  //result return
  dataSearch;
  //
  totalOnProceeded = 0;
  deposit = 0;
  totalOnPreceededAndDeposit;
  totalPayment = 0;

  formCustomer = new FormGroup({
    searchJob: new FormControl(),
    workDate: new FormControl(),
    endworkDate: new FormControl(),
  })
  formDriver = new FormGroup({
    searchJob: new FormControl(),
    // selectSearchJob: new FormControl(),
    workDate: new FormControl(),
    endworkDate: new FormControl(),
  })
  formStatus = new FormGroup({
    searchJob: new FormControl(),
    workDate: new FormControl(),
    endworkDate: new FormControl(),
  })

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.db.list('wikis').snapshotChanges().map(action => {
      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis;
    });

    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job2 => {
      // console.log('notification', job2)
      this.job2 = job2;
      // this.job = job

      console.log('checkTime', this.job2.length);
      for (let i = 0; i < this.job2.length; i++) {
        const jobTime = {
          ...this.job2[i],
        }
        console.log('jobtime', jobTime);

        let checkStatus = jobTime.value;
        let sum = +checkStatus.totalPayment;
        let depositNotProceeded = +checkStatus.deposit;

        // console.log('checkStatus', checkStatus);
        if (checkStatus.status === 'proceeded') {
          console.log('checkStatus.totalPayment', checkStatus.totalPayment);
          this.totalOnProceeded = (this.totalOnProceeded + sum)
          // console.log('this.totalPayment', this.totalPayment);
        }
        if (checkStatus.status !== 'proceeded') {
          this.deposit = this.deposit + depositNotProceeded
        }
        this.totalPayment = this.totalPayment + sum


      }
      console.log('total', this.totalOnProceeded, 'deposit', this.deposit, 'totalPayment');
      this.totalOnPreceededAndDeposit = this.totalOnProceeded + this.deposit
      console.log('this.totalOnPreceededAndDeposit', this.totalOnPreceededAndDeposit);
      console.log('totalPayment', this.totalPayment);

    });

  }

  searchJob(data1) {
    console.log('data', data1.value);
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log('job', job)
      const startDate = new Date(data1.value.workDate.year, data1.value.workDate.month - 1, data1.value.workDate.day);
      const endDate = new Date(data1.value.endworkDate.year, data1.value.endworkDate.month - 1, data1.value.endworkDate.day)
      console.log('startDate', startDate);
      console.log('endDate', endDate);




      this.job = job.filter((data: any) => {
        // const jobDate = new Date(2019, data.value.workDate.month - 1, data.value.workDate.day);
        const jobDate = new Date(data.value.workDate.year, data.value.workDate.month - 1, data.value.workDate.day);
        const searchJob = data1.value.searchJob;

        if (this.checkSelect) {
          if (this.checkSelect === 'customerFirstname') {
            console.log('searchJobBySelect customerFirstname');
            this.dataSearch = data.value.customerFirstname;
          }
          if (this.checkSelect === 'driver') {
            console.log('searchJobBySelect driver');
            this.dataSearch = data.value.driver;
          }
          if (this.checkSelect === 'status') {
            console.log('searchJobBySelect status');
            this.dataSearch = data.value.status
          }
        }

        if (searchJob && startDate && endDate) {
          return jobDate.getTime() >= startDate.getTime() && jobDate.getTime() <= endDate.getTime()
            && this.dataSearch === searchJob;

        }



      }
      )
      this.totalOnProceeded = 0;
      this.deposit = 0;
      this.totalOnPreceededAndDeposit = 0;
      this.totalPayment = 0;
      console.log('thisjob', this.job.length,this.job);
      for (let i = 0; i < this.job.length; i++) {
        const jobTime = {
          ...this.job[i],
        }
        console.log('jobtime', jobTime);

        let checkStatus = jobTime.value;
        let sum = +checkStatus.totalPayment;
        let depositNotProceeded = +checkStatus.deposit;

        // console.log('checkStatus', checkStatus);
        if (checkStatus.status === 'proceeded') {
          console.log('checkStatus.totalPayment', checkStatus.totalPayment);
          this.totalOnProceeded = (this.totalOnProceeded + sum)
          // console.log('this.totalPayment', this.totalPayment);
        }
        if (checkStatus.status !== 'proceeded') {
          this.deposit = this.deposit + depositNotProceeded
        }
        this.totalPayment = this.totalPayment + sum


      }
      console.log('total', this.totalOnProceeded, 'deposit', this.deposit, 'totalPayment');
      this.totalOnPreceededAndDeposit = this.totalOnProceeded + this.deposit
      console.log('this.totalOnPreceededAndDeposit', this.totalOnPreceededAndDeposit);
      console.log('totalPayment', this.totalPayment);




    });
  }

  //  old function
  // searchJob(data1) {
  //   console.log('data', data1.value);
  //   this.db.list('job').snapshotChanges().map(actions => {
  //     return actions.map(action => ({ key: action.key, value: action.payload.val() }));
  //   }).subscribe(job => {
  //     console.log('job', job)
  //     const startDate = new Date(data1.value.workDate.year, data1.value.workDate.month - 1, data1.value.workDate.day);
  //     const endDate = new Date(data1.value.endworkDate.year, data1.value.endworkDate.month - 1, data1.value.endworkDate.day)
  //     console.log('startDate', startDate);
  //     console.log('endDate', endDate);




  //     this.job = job.filter((data: any) => {
  //       // const jobDate = new Date(2019, data.value.workDate.month - 1, data.value.workDate.day);
  //       const jobDate = new Date(data.value.workDate.year, data.value.workDate.month - 1, data.value.workDate.day);
  //       const searchJob = data1.value.searchJob;

  //       if (this.checkSelect) {
  //         if (this.checkSelect === 'customerFirstname') {
  //           console.log('searchJobBySelect customerFirstname');
  //           this.dataSearch = data.value.customerFirstname;
  //         }
  //         if (this.checkSelect === 'driver') {
  //           console.log('searchJobBySelect driver');
  //           this.dataSearch = data.value.driver;
  //         }
  //         if (this.checkSelect === 'status') {
  //           console.log('searchJobBySelect status');
  //           this.dataSearch = data.value.status
  //         }
  //       }

  //       if (searchJob && startDate && endDate) {
  //         return jobDate.getTime() >= startDate.getTime() && jobDate.getTime() <= endDate.getTime()
  //           && this.dataSearch === searchJob;

  //       }
  //       console.log('jobbbbbb', this.job.length);
  //       if (searchJob) {
  //         console.log('searchJob');
  //         return this.dataSearch === searchJob;
  //       }

  //       // if (selectSearchJobByDriver && startDate && endDate) {
  //       //   return jobDate.getTime() >= startDate.getTime() && jobDate.getTime() <= endDate.getTime()
  //       //     && searchDriver === searchJob;
  //       // }


  //       else {
  //         console.log('data else', data);
  //         return data
  //       }
  //     }
  //     );
  //   });
  // }


  // selectValue(dataValue) {
  //   console.log(dataValue.target.value);
  //   const selectValue = dataValue.target.value;
  //   this.searchSelectValue
  // }



  selectCheckValue(event) {
    // console.log('showValue', event.target.value.split(","));
    // const getCar = car.target.value.split(",");
    // const carModel = getCar[0];

    // this.selectedCarModel[index] = carModel;
    // this.selectedCarId[index] = carId;
    // this.selectedTokenlDriver[index] = driverToken;
    // console.log('index', index);
    this.checkSelect = event.target.value
    console.log('checkSelect', this.checkSelect);

    if (event.target.value === 'customerFirstname') {
      // console.log('customerFirstname');
      this.checkCustomer = true;
      this.checkDriver = false;
      this.checkStatusJob = false;
    }
    if (event.target.value === 'driver') {
      // console.log('driver');
      this.checkCustomer = false;
      this.checkDriver = true;
      this.checkStatusJob = false;
    }
    if (event.target.value === 'status') {
      // console.log('status');
      this.checkCustomer = false;
      this.checkDriver = false;
      this.checkStatusJob = true;
    }
  }
}
