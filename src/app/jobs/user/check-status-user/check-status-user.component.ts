import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-check-status-user',
  templateUrl: './check-status-user.component.html',
  styleUrls: ['./check-status-user.component.css']
})
export class CheckStatusUserComponent implements OnInit {
  currentRate;
  job: any[];
  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = false;
  }
  formTemplate: FormGroup = new FormGroup({
    review: new FormControl('', Validators.required),
    rateReview: new FormControl('', Validators.required),

  })

  ngOnInit() { }
  searchJob(data1) {
    console.log('data', data1.value);

    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      // console.log('job', job)
      // const startDate = new Date(data1.value.workDate.year, data1.value.workDate.month - 1, data1.value.workDate.day);
      // const endDate = new Date(data1.value.endworkDate.year, data1.value.endworkDate.month - 1, data1.value.endworkDate.day)
      // console.log('startDate', startDate);
      // console.log('endDate', endDate);

      this.job = job.filter((data: any) => data.value.customerPhone === data1.value.searchJob);
    });

  }
  editJob(formTemplate, data) {
    console.log('editJob working', formTemplate.value);
    const jobData = formTemplate.value
    console.log('job', jobData);
    this.firebaseService.editJob(data.key, jobData);
  }

  openBill(content, dataFormJob, alert222) {
    if (dataFormJob.value.status === 'proceeded'  ) {
      console.log(111);
      this.modalService.open(content);
    }
    else {
      console.log('ให้คะแนนไม่ได้');

      this.modalService.open(alert222);
    }
  }


}
