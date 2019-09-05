import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
@Component({
  selector: 'app-search-job',
  templateUrl: './search-job.component.html',
  styleUrls: ['./search-job.component.css']
})
export class SearchJobComponent implements OnInit {
  jobList: AngularFireList<any>
  job: any[];

  carList: AngularFireList<any>;
  wikis: any[];

  car: any[];

  searchSelectValue = [];

  selectedNameDriver = [];
  selectedEmailDriver = [];



  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute) { }

  ngOnInit() { }


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
        const jobDate = new Date(2019, data.value.workDate.month - 1, data.value.workDate.day);
        // const jobDate = new Date(data.value.workDate.year, data.value.workDate.month - 1, data.value.workDate.day);
        const searchJob = data1.value.searchJob;
        const selectSearchJobByCustomerFirstname = data1.value.selectSearchJob === 'customerFirstname';
        const selectSearchJobByDriver = data1.value.selectSearchJob === 'driver';

        console.log('data  workdate', data.value.workDate.year);

        console.log('jobdata', jobDate);

        const searchCustomerFirstname = data.value.customerFirstname;
        const searchDriver = data.value.driver;


        if (selectSearchJobByCustomerFirstname && startDate && endDate) {
          return jobDate.getTime() >= startDate.getTime() && jobDate.getTime() <= endDate.getTime()
            && searchCustomerFirstname === searchJob;
        }
        if (selectSearchJobByDriver && startDate && endDate) {
          return jobDate.getTime() >= startDate.getTime() && jobDate.getTime() <= endDate.getTime()
            && searchDriver === searchJob;
        }
        else {
        console.log(data);
        
          return data
        }

      }
      );







      // (data.value.workDate.day >= data1.value.workDate.day
      //   &&
      //   data.value.workDate.month >= data1.value.workDate.month &&
      //   data.value.workDate.month != data1.value.endworkDate.month
      //   &&
      //   data.value.workDate.year >= data1.value.workDate.year
      // )
      // ||
      // (data.value.workDate.day <= data1.value.endworkDate.day
      //   &&
      //   data.value.workDate.month <= data1.value.endworkDate.month &&
      //   data.value.workDate.month != data1.value.workDate.month
      //   &&
      //   data.value.workDate.year <= data1.value.endworkDate.year
      // ));


    });

  }

  selectValue(dataValue) {
    console.log(dataValue.target.value);
    const selectValue = dataValue.target.value;
    this.searchSelectValue
  }
}
