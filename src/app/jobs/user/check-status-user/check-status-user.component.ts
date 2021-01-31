import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-check-status-user',
  templateUrl: './check-status-user.component.html',
  styleUrls: ['./check-status-user.component.css']
})
export class CheckStatusUserComponent implements OnInit, OnChanges {

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  currentRate;
  job: any[];
  wikis: any[];
  wikis111;

  //map
  latitude: number;
  longitude: number;
  zoom: number;
  id;

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private config: NgbRatingConfig,
    private router: Router) {
    config.max = 5;
    config.readonly = true;
  }
  formTemplate: FormGroup = new FormGroup({
    review: new FormControl(),
    rateReview: new FormControl(),

  })

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    console.log('ngOnInit', this.id);

    this.searchJob(this.id);
    this.zoom = 17;

    this.db.list('wikis').snapshotChanges().map(action => {
      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis;
    });

  }

  newSearchJob(data1) {
    console.log('data1', data1.value);
    // this.router.navigate([`/checkstatus/${data1.value.searchJob}`]);
    window.open(`/checkstatus/${data1.value.searchJob}`)
    this.id = data1.value.searchJob
    console.log('id', this.id);
    this.searchJob(this.id);

  }

  searchJob(data1) {
    console.log('data', data1);

    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log('job', job)
      // const startDate = new Date(data1.value.workDate.year, data1.value.workDate.month - 1, data1.value.workDate.day);
      // const endDate = new Date(data1.value.endworkDate.year, data1.value.endworkDate.month - 1, data1.value.endworkDate.day)
      // console.log('startDate', startDate);
      // console.log('endDate', endDate);

      this.job = job.filter((data: any) => data.value.time == data1 && data.value.statusDelete !== 'delete');
      console.log('this.job', this.job);

    });

  }

  editJob(formTemplate, data) {
    // console.log('editJob working', formTemplate.value);
    // console.log('editJob data', data.value);
    const jobData = formTemplate.value
    console.log('job', jobData);
    this.firebaseService.editJob(data.key, jobData);
    // console.log('formTemplate', formTemplate, 'data', data.value);


    console.log('length', this.wikis.length);
    for (let i = 0; i < this.wikis.length; i++) {
      const getNameDriver = {
        ...this.wikis[i],
      }

      let driver = getNameDriver.value
      if (data.value.driver == driver.firstname) {
        console.log('ชื่อพนักงานขับรถตรงกันนะ');
        if (driver.rateReview) {
          let dataEmp = {
            ...driver,
            rateReview: (driver.rateReview + jobData.rateReview) / 2,
          }
          this.firebaseService.editWiki(this.wikis[i].key, dataEmp);
        } else {
          let dataEmp = {
            ...driver,
            rateReview: jobData.rateReview,
          }
          this.firebaseService.editWiki(this.wikis[i].key, dataEmp);
        }
      }
    }
    this.config.readonly = true;
  }


  openMap(map, data222, notMap) {
    console.log('data222', data222);

    console.log('data222', data222.value.emailDriver);
    let driver = data222.value.emailDriver;

    // this.db.list('wikis').snapshotChanges().map(actions => {
    //   return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    // }).subscribe(wikis => {
    //   this.wikis = wikis.filter((data: any) => data.value.driver === data222.value.driver);
    // });

    this.db.list('wikis').snapshotChanges().map(action => {

      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis.filter((data: any) => data.value.firstname === data222.value.driver)
      console.log('this.wikis', this.wikis.length);
    });

    if (data222.value.status === 'proceed') {
      console.log('openMap');
      this.modalService.open(map);
    }
    // if(data222)
    else {
      console.log('ให้คะแนนไม่ได้');
      this.modalService.open(notMap);
    }
  }
  checkSatatusProceedWhenFinish(data, content) {
    console.log('checkSatatusProceedWhenFinish');

    if (data.value.status === 'proceeded') {
      console.log('finish');
      this.modalService.open(content);
    }

  }

  openBill(content, dataFormJob, alert222) {
    this.config.readonly = false;
    if (dataFormJob.value.status === 'proceeded') {
      console.log(111);
      this.modalService.open(content);
    }
    else {
      console.log('ให้คะแนนไม่ได้');
      this.modalService.open(alert222);
    }
  }


}
