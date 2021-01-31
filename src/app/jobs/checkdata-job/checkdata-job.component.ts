import { Component, OnInit, OnChanges, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { AppComponent } from 'src/app/app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import _ from "lodash";

import { ProvincesService } from '../../services/provinces/provinces.service';
@Component({
  selector: 'app-checkdata-job',
  templateUrl: './checkdata-job.component.html',
  styleUrls: ['./checkdata-job.component.css']
})
export class CheckdataJobComponent implements OnInit, OnChanges {


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

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
  //checkSubmit And Delete
  checkSubmitAndDel = [];
  iconUrl = "https://image.flaticon.com/icons/svg/1397/1397898.svg";

  latitudeSource;
  longitudeSource;
  latitudeDestination;
  longitudeDestination;
  province;
  distictSource;
  distictDestination
  objCountrySource;
  objCountryDestination;

  testttt: boolean = true;

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  formGroup: FormGroup = new FormGroup({
    customerFirstname: new FormControl(),
    worktype: new FormControl(),
    source: new FormControl(),
    destination: new FormControl(),
    customerPhone: new FormControl(),
    detail: new FormControl(),
    workDate: new FormControl(),
    timeHour: new FormControl(),
    provinceSource: new FormControl(),
    distictSource: new FormControl(),
    subDistictSource: new FormControl(),
    provinceDestination: new FormControl(),
    distictDestination: new FormControl(),
    subDistictDestination: new FormControl(),

  })

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private mapsAPILoader: MapsAPILoader,
    private provincesService: ProvincesService) {
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
      // console.log('job', job)
      this.job = job.filter((data: any) => data.value.status === 'checkdata' && data.value.statusDelete !== 'delete');
      // this.job = job
      // console.log('thisjob', this.job);
      for (let index = 0; index < this.job.length; index++) {
        // console.log(this.job[index]);
        this.job[index].value = {
          ...this.job[index].value,
          statusSendEmail: 'unsend'
        }
      }

      console.log('thisjob', this.job);
      this.job.sort(function (x, y) {

        let ax = x.value.workDate.split("/");
        let ay = y.value.workDate.split("/");
        // console.log(ax, ay);

        ax = new Date(ax[1] + 1, ax[0], ax[2]).getTime();
        ay = new Date(ay[1] + 1, ay[0], ay[2]).getTime();
        // console.log('ax', ax, 'ay', ay);

        // return ax - ay ;
        return ay - ax;
        // return ax < ay ? -1 : ax > ay ? 1 : 0;
        // return ax > ay ? -1 : ax < ay ? 1 : 0;
      });

    });

    //wikis
    this.db.list('wikis').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      // console.log(wikis)
      this.wikis = wikis;

    });

    this.getProvince();
  }




  delJob(data) {
    // this.firebaseService.removeJob(data.key);
    console.log(data.value);
    const jobData = {
      ...data.value,
      statusDelete: 'delete',

    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);
  }

  editJob(data) {
    console.log(data.value);
    let jobData = {
      ...data.value,
      status: 'checkpayment',
      statusSendEmail: 'send',

    }
    console.log('send', jobData);
    this.firebaseService.editJob(data.key, jobData);

    jobData = {
      ...jobData,
      statusSendEmail: 'unsend',
    }
    console.log('unsend', jobData);
    this.firebaseService.editJob(data.key, jobData);
  }

  open(content, value) {
    if (value === 'submit') {
      this.checkSubmitAndDel[0] = "ต้องการยืนยันงานหรือไม่";
      this.checkSubmitAndDel[1] = "ยืนยัน";
    }
    if (value === 'del') {
      this.checkSubmitAndDel[0] = "ต้องการลบการจ้างหรือไม่";
      this.checkSubmitAndDel[1] = "ลบ";
    }
    this.modalService.open(content);
  }

  openMap(map) {
    this.modalService.open(map, { size: 'lg' });
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

  openData(con, data) {
    console.log('showdataDialog', data.value);
    // console.log(dataOfDailog.key);
    let provinceSource = data.value.provinceSource;
    let distictSource = data.value.distictSource;
    let subDistictSource = data.value.subDistictSource;
    let provinceDestination = data.value.provinceDestination;
    let distictDestination = data.value.distictDestination;
    let subDistictDestination = data.value.subDistictDestination;

    this.distictSource = provinceSource;
    this.distictDestination = provinceDestination;
    this.modalService.open(con, { size: 'xl' });
    this.objCountrySource = this.provincesService.getCountry(provinceSource, distictSource, subDistictSource);
    this.objCountryDestination = this.provincesService.getCountry(provinceDestination, distictDestination, subDistictDestination);
    console.log('objCountry', this.objCountrySource, this.objCountryDestination);

  }

  buttonEdit(data) {
    console.log(data);
    if (data == 'edit') {

      this.showEdit = false;
    }
    if (data == 'closeEdit') {
      this.showEdit = true;

    }
  }

  editForm(jobForm, data) {
    // this.showEdit = true;
    // console.log('editForm', jobForm.value, data.value);
    let newData = {
      ...data.value,
      ...jobForm.value
    }
    if (this.latitudeSource && this.longitudeSource) {
      console.log('latitudeSource', this.latitudeSource, 'longtitudeSoure', this.longitudeSource);
      newData = {
        ...newData,
        sourceLatitude: this.latitudeSource,
        sourceLongitude: this.longitudeSource
      }

      this.latitudeSource = '';
      this.longitudeSource = '';
    }
    if (this.latitudeDestination && this.longitudeDestination) {
      console.log('latitudeDestination', this.latitudeDestination, 'longtitudeDestination', this.longitudeDestination);
      newData = {
        ...newData,
        destLatitude: this.latitudeDestination,
        destLongitude: this.longitudeDestination
      }
      this.latitudeDestination = '';
      this.longitudeDestination = '';
    }

    console.log(newData);
    this.firebaseService.editJob(data.key, newData);


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


  getCurentAddress() {
    this.wikis;
    console.log(this.wikis.length);
    // console.log(getDataWikis[0].key);
    for (let i = 0; i < this.wikis.length; i++) {
      console.log('test')
      const setCurrentWikis = {
        ...this.wikis[i],
      }
      let setCurrent = setCurrentWikis.value
      let setCur2 = {
        ...setCurrent,
        currentLat2: '',
        currentLong2: '',
        sendCoordinates: 'send!',
      }
      console.log('setCurrent', setCurrent);
      console.log('setCur2', setCur2);
      // console.log('setCurrentWikis', setCurrentWikis);
      // console.log('showValue', this.wikis[i].key,);

      this.firebaseService.editWiki(this.wikis[i].key, setCur2);
    }

  }

  resetCoordinates() {
    this.wikis;
    console.log(this.wikis.length);
    // console.log(getDataWikis[0].key);
    for (let i = 0; i < this.wikis.length; i++) {
      console.log('test')
      const setCurrentWikis = {
        ...this.wikis[i],
      }
      let setCurrent = setCurrentWikis.value
      let setCur2 = {
        ...setCurrent,
        sendCoordinates: '',
      }
      console.log('setCurrent', setCurrent);
      console.log('setCur2', setCur2);
      // console.log('setCurrentWikis', setCurrentWikis);
      // console.log('showValue', this.wikis[i].key,);

      this.firebaseService.editWiki(this.wikis[i].key, setCur2);
    }
  }

  markerDragEnd($event: MouseEvent) {
    console.log('$event', $event);
    this.latitudeSource = $event.coords.lat;
    this.longitudeSource = $event.coords.lng;
    // console.log('latitudeSource', this.latitudeSource, 'longitudeSource', this.longitudeSource);
  };

  markerDragEnd2($event: MouseEvent) {
    console.log('$event', $event);
    this.latitudeDestination = $event.coords.lat;
    this.longitudeDestination = $event.coords.lng;
    // console.log('latitudeDestination', this.latitudeDestination, 'longitudeDestination', this.longitudeDestination);
  };

  getProvince() {
    this.province = this.provincesService.searchProvince();
    // console.log('getProvince', this.province);
    // console.log('province', this.province);
  }

  changeProvnice(data, type) {
    console.log(data.target.value);
    if (type == 'source') {
      this.distictSource = data.target.value
      this.objCountrySource = this.provincesService.selectProvince(data.target.value);
      console.log('objCountry', this.objCountrySource);
    }

    if (type == 'destination') {
      this.distictDestination = data.target.value
      this.objCountryDestination = this.provincesService.selectProvince(data.target.value);
      console.log('objCountry', this.objCountryDestination);
    }

  }

  changeDistict(event, type) {
    if (type == 'source') {
      this.objCountrySource.dt = this.provincesService.selectDistict(this.distictSource, event.target.value);
      console.log('this.objCountry.dv[1]', this.objCountrySource.dt[1]);

    }
    if (type == 'destination') {
      this.objCountryDestination.dt = this.provincesService.selectDistict(this.distictDestination, event.target.value);
      console.log('this.objCountry.dv[1]', this.objCountryDestination.dt[1]);

    }
  }

  newEditJob(data){
    // this.modalService.dismissAll();
    window.open(`/editjob/${data.key}`);

  }

}
