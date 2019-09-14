import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-checkdata-job',
  templateUrl: './checkdata-job.component.html',
  styleUrls: ['./checkdata-job.component.css']
})
export class CheckdataJobComponent implements OnInit {
  jobList: AngularFireList<any>
  job: any[];

  List: AngularFireList<any>;
  showEdit = true;
  // display: boolean = false;
  //map
  latitude: number;
  longitude: number;
  zoom: number;
  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private mapsAPILoader: MapsAPILoader) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit() {
    //map
     this.setCurrentLocation();
    //
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log(job.length)
      this.job = job.filter((data: any) => data.value.status === 'checkdata');
      // this.job = job

    });
  }




  delJob(data) {
    this.firebaseService.removeJob(data.key);
  }
  editJob(data) {
    console.log(data.value);
    const jobData = {
      ...data.value,
      status: 'checkpayment'
    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);
  }

  open(content) {
    this.modalService.open(content);
  }
  openMap(map) {
    this.modalService.open(map);
  }

  openData(con, ) {
    console.log('showdataDialog', con);
    // console.log(dataOfDailog.key);

    this.modalService.open(con);
  }

  buttonEdit() {
    this.showEdit = false;
  }

  buttonSave() {
    this.showEdit = true;
  }

  //map
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        this.zoom = 12;
        // this.zoom = 18;

      });
    }
  };
}
