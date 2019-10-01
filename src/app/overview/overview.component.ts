import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnChanges {


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }
  public isCollapsed = false;

  job: any[];
  wikis: any[];
  car: any[];

  //rateReivew
  totalReview = 0;
  totalDivideReview = 0;
  totalReviewDriver = 0;
  totalDivideReviewDriver = 0;

  //date
  publicStartDate;
  publicEndDate;
  checkStartDate;
  checkEndDate;
  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    // this.db.list('job').snapshotChanges().map(actions => {
    //   return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    // }).subscribe(job => {
    //   console.log('job', job)
    //   this.job = job;
    // });


    this.db.list('wikis').snapshotChanges().map(action => {
      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis;
      console.log('jobLength', this.wikis.length);
      for (let i = 0; i < this.wikis.length; i++) {
        const dataObjEmp = {
          ...this.wikis[i],
        }
        let dataEmp = dataObjEmp.value;
        // console.log('driver',checkStatus.driver);

        if (dataEmp.rateReview) {
          this.totalDivideReview = this.totalDivideReview + 1
          let sum = dataEmp.rateReview
          this.totalReview = (this.totalReview + sum)
        }

      }

      console.log('totalDivideReview', this.totalDivideReview);
      this.totalReview = this.totalReview / this.totalDivideReview
      console.log('totalReview', this.totalReview);
      let intTotalReview = Math.ceil(this.totalReview)
      console.log('intTotalReview', intTotalReview);



    });
  }

  searchJob(data1) {
    //กำหนด true ไว้ ในกรณีที่ มีค่าวันที่ ต้นทาง กับปลายจะ จะเอาไปfilter อีกfunction
    this.checkEndDate = true;
    this.checkStartDate = true;

    // this.db.list('wikis').snapshotChanges().map(action => {
    //   return action.map(action => ({ key: action.key, value: action.payload.val() }));
    // }).subscribe(wikis => {
    //   console.log(wikis)
    //   this.wikis = wikis;
    // });


    console.log(data1.value);
    console.log('workdate', data1.value.workDate);
    // console.log('workdate', data1.value.workDate.day);
    // console.log('workdate', data1.value.workDate.month);
    // console.log('workdate', data1.value.workDate.year);
    console.log('endworkDate', data1.value.endworkDate);
    // console.log('endworkDate', data1.value.endworkDate.day);
    // console.log('endworkDate', data1.value.endworkDate.month);
    // console.log('endworkDate', data1.value.workDate.year);
    if (data1.value.workDate === '') {
      console.log('this.checkStartDate = false');

      this.checkStartDate = false;
    }
    if (data1.value.endworkDate === '') {
      console.log('this.checkEndDate = false;');

      this.checkEndDate = false;
    }


    const startDate = new Date(data1.value.workDate.year, data1.value.workDate.month - 1, data1.value.workDate.day);
    const endDate = new Date(data1.value.endworkDate.year, data1.value.endworkDate.month - 1, data1.value.endworkDate.day)
    this.publicStartDate = startDate;
    this.publicEndDate = endDate;

    // this.db.list('job').snapshotChanges().map(actions => {
    //   return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    // }).subscribe(job => {
    //   console.log(job);
    //   const startDate = new Date(data1.value.workDate.year, data1.value.workDate.month - 1, data1.value.workDate.day);
    //   const endDate = new Date(data1.value.endworkDate.year, data1.value.endworkDate.month - 1, data1.value.endworkDate.day)
    //   this.job = job.filter((data: any) => {

    //     const jobDate = new Date(data.value.workDate.year, data.value.workDate.month - 1, data.value.workDate.day);
    //     return jobDate.getTime() >= startDate.getTime() && jobDate.getTime() <= endDate.getTime();
    //   }


    //   )
    // });

  }

  showJobByDriver(data1Firstname) {
    console.log('data1Firstname', data1Firstname);

    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      this.job = job.filter((data: any) => {
        const jobDate = new Date(data.value.workDate.year, data.value.workDate.month - 1, data.value.workDate.day);
        if (this.checkStartDate === true && this.checkEndDate === true) {
          console.log('startDate and endDate');

          return data.value.driver === data1Firstname.value.firstname
            && jobDate.getTime() >= this.publicStartDate.getTime() && jobDate.getTime() <= this.publicEndDate.getTime();
        }
        if (this.checkStartDate === true && this.checkEndDate === false) {
          console.log('only startDate ');
          return data.value.driver === data1Firstname.value.firstname && jobDate.getTime() >= this.publicStartDate.getTime();
        }
        if (this.checkStartDate === false && this.checkEndDate === true) {
          console.log('only endDate');
          return data.value.driver === data1Firstname.value.firstname && jobDate.getTime() <= this.publicEndDate.getTime();
        }
        else {
          console.log('No date');
          return data.value.driver === data1Firstname.value.firstname

        }


      });
      console.log('thisjob', this.job.length, this.job);


    });

    console.log("showByDriver", data1Firstname.value.firstname);

  }

  printInvoice(data) {
    console.log('111', data.value);
    this.router.navigate([`/invoice/${data.key}`]);
  }
}
