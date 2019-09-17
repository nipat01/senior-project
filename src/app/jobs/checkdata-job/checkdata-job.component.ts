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
  wikis: any[];
  List: AngularFireList<any>;
  showEdit = true;
  Addrres = false;
  currentAddrres = false;
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
      console.log('job', job)
      this.job = job.filter((data: any) => data.value.status === 'checkdata');
      // this.job = job
    });

    //wikis
    this.db.list('wikis').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis;

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
  showCurrentAddress(checkAddress) {
    console.log('currentMap', checkAddress);
    if (checkAddress === 'addressEmp') {
      console.log('111');

      this.currentAddrres = false;
      this.Addrres = true;
    }
    if (checkAddress == 'currentAddressEmp') {
      console.log('222');
      this.currentAddrres = true;
      this.Addrres = false;
    }
    if (checkAddress == 'clearAddressEmp') {
      console.log('333');
      this.currentAddrres = false;
      this.Addrres = false;
    }
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
