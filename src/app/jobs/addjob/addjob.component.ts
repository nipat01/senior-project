import { Component, OnInit, ViewChild, ElementRef, NgZone, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LineNotifyService } from 'src/app/services/line-notify.service';
import * as cors from 'cors';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { NgbModal, NgbModalConfig, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

import *  as  data from '../../../../province.json';
@Component({
  selector: 'app-addjob',
  templateUrl: './addjob.component.html',
  styleUrls: ['./addjob.component.css']
})

export class AddjobComponent implements OnInit, OnChanges {

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  //map-----------------------------------------------------------------------------------------------
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  latitude2: number;
  longitude2: number;
  latitude11;
  longitude11;
  latitude22;
  longitude22;
  checkLonglat = true;
  checkLongLat2 = true;

  zoom: number;
  address: string;
  address2: string;
  exampleCheck1: boolean = false;
  iconUrl = "https://image.flaticon.com/icons/svg/1397/1397898.svg";
  private geoCoder;

  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;
  @ViewChild('search2', { static: false })
  public searchElementRef2: ElementRef;
  //addJob
  token;

  products: any = data;
  province = [];
  province2 = [];
  province3 = [];
  distict;
  distict2;
  distict3;
  subDistict;
  subDistict2;
  subDistict3;
  post;
  post2;
  post3;

  isSubmitted: boolean;

  checkMap = true;
  checkBoxAddJob = false;

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }


  constructor(private db: AngularFireDatabase,
    private lineNotify: LineNotifyService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private modalService: NgbModal,
    private router: Router,
    private config: NgbDatepickerConfig) {
    const current = new Date();
    config.minDate = {
      year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate()
    };
    //config.maxDate = { year: 2099, month: 12, day: 31 };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    this.setCurrentLocation();
    this.products = this.products.default
    console.log(this.products)



    let time = new Date();
    console.log('time', time.getHours(), time.getUTCHours());

    //map--------------------------------------------------------------------------------------------
    // this.setCurrentLocation();
    this.mapsAPILoader.load().then(() => {
      // console.log(' this.setCurrentLocation()', this.setCurrentLocation());

      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["establishment", "geocode"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log('place', place);
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.getAddress(this.latitude, this.longitude);
          this.zoom = 12;
        });
      });

      let autocomplete2 = new google.maps.places.Autocomplete(this.searchElementRef2.nativeElement, {
        types: ["establishment", "geocode"]
      });
      autocomplete2.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete2.getPlace();
          console.log('place2', place);

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude2 = place.geometry.location.lat();
          this.longitude2 = place.geometry.location.lng();
          this.getAddress2(this.latitude2, this.longitude2);
          this.zoom = 12;
        });
      });
    });


    //addJob
    this.db.list('token').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(token => {
      console.log('token', token[0].value)
      this.token = token;
    });
  }


  addjob(data: NgForm) {
    console.log('valid', data.valid);
    console.log(data.value);
    this.isSubmitted = true;
    if (data.valid) {
      console.log('addJob Token', this.token[0].value.tokenAdmin);

      let time = new Date();
      let jobData = {
        ...data.value,
        status: 'checkdata',
        statusDelete: 'unDelete',
        driver: '',
        totalPayment: '',
        deposit: '',
        bill: '',
        billNo: '',
        billImageUrl: '',
        billNoImageUrl: '',
        sourceLatitude: this.latitude,
        sourceLongitude: this.longitude,
        // source: `${data.value.source} ตำบล: ${this.province[2]} อำเภอ:${this.province[1]} จังหวัด:${this.province[0]} ไปรษณีย์:${this.post[0]} `,
        // source: this.address,
        subDistictSource: `${this.province[2]}`,
        distictSource: `${this.province[1]}`,
        provinceSource: `${this.province[0]}`,
        // postSource: `${this.post[0]}`,

        // destination: `${data.value.destination} ตำบล:${this.province2[2]} อำเภอ:${this.province2[1]} จังหวัด:${this.province2[0]} ไปรษณีย์:${this.post2[0]}`,
        // destination: this.address2,
        subDistictDestination: `${this.province2[2]}`,
        distictDestination: `${this.province2[1]}`,
        provinceDestination: `${this.province2[0]}`,
        // postDestination: `${this.post2[0]}`,

        destLatitude: this.latitude2,
        destLongitude: this.longitude2,
        token: this.token[0].value.tokenAdmin,
        workDate: `${data.value.workDate.day}/${data.value.workDate.month}/${data.value.workDate.year}`,
        time: time.getTime(),
        // workTime: `${data.value.timeHour}:${data.value.timeMinute} น.`,
        timeHour: +data.value.timeHour,
        statusSendEmail: 'send',
      }
      if (this.checkBoxAddJob) {
        jobData = {
          ...jobData,
          addressForInvoice: `${data.value.addressForInvoice} ตำบล ${this.province3[2]} อำเภอ${this.province3[1]} จังหวัด${this.province3[0]}} `
        }
      }
      // ไม่ได้ใช้
      // from(this.db.list("/job").push(jobData)).pipe(
      //   switchMap(() => {
      //     return this.lineNotify.postMessage('test');
      //   }),
      //   ).subscribe(result => console.log(result));
      console.log('jobdata', jobData);

      // กำลังใช้
      this.db.list("/job").push(jobData).then(this.goToHome)

      // ใช้อยู่
      // this.db.list("/job").push(data.value).child('status').set("waiting");
    }
  }

  openData(conMap) {
    console.log('showdataDialog', conMap);
    // console.log(dataOfDailog.key);
    this.modalService.open(conMap);
  }


  //map--------------------------------------------------------------------------------------------------
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        // this.latitude2 = position.coords.latitude;
        // this.longitude2 = position.coords.longitude;
        this.zoom = 18;
        this.getAddress(this.latitude, this.longitude);
        // this.getAddress(this.latitude2, this.longitude2);
      });
    }
  };

  // markerDragEnd($event: MouseEvent) {
  //   console.log('$event', $event);
  //   this.latitude = $event.coords.lat;
  //   this.longitude = $event.coords.lng;
  //   this.latitude2 = $event.coords.lat;
  //   this.longitude2 = $event.coords.lng;
  //   this.getAddress(this.latitude, this.longitude);
  //   console.log('this.getAddress(this.latitude, this.longitude)', this.getAddress(this.latitude, this.longitude));

  //   this.getAddress(this.latitude2, this.longitude2);
  // };

  markerDragEnd($event: MouseEvent) {
    console.log('$event', $event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    console.log('latitude', this.latitude, 'longitude', this.longitude);
    this.checkLonglat = false;

  };

  markerDragEnd2($event: MouseEvent) {
    console.log('$event', $event);
    this.latitude2 = $event.coords.lat;
    this.longitude2 = $event.coords.lng;
    console.log('longitude2', this.longitude2, 'longitude2', this.longitude2);
    this.checkLongLat2 = false;
  };

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log('results', results);
      console.log('status', status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;

          this.address = results[0].formatted_address;
          console.log('this.address', this.address);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
  getAddress2(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log('results', results);
      console.log('status', status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;

          this.address2 = results[0].formatted_address;
          console.log('this.address', this.address);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  goToHome = () => {
    console.log('this is homepage');
    this.router.navigate(['/bankuser']);
  }


  searchProvince() {
    console.log('province', this.products);
  }

  selectProvince(evnet, type) {
    console.log('types', type);

    let event2 = evnet.target.value.split(",")
    let distict = event2[0];
    let index = event2[1];
    if (type === 'taxInvoice') {
      this.province3[0] = this.products[index][0];
      this.distict3 = this.products[index][1];

    }
    else {
      this.province[0] = this.products[index][0];
      this.distict = this.products[index][1];

    }
    console.log(this.province[0], this.distict);
  }

  selectDistict(evnet, type) {
    // console.log(evnet.target.value.split(","));
    let event2 = evnet.target.value.split(",")
    let distict = event2[0];
    let index = event2[1];
    if (type === 'taxInvoice') {

      this.province3[1] = this.distict3[index][0]
      this.subDistict3 = this.distict3[index][1];
    }
    else {
      this.province[1] = this.distict[index][0]
      this.subDistict = this.distict[index][1];

    }
    console.log(this.province[1], this.subDistict);
  }

  selectSubDistict(evnet, type) {
    // console.log(evnet.target.value.split(","));

    let event2 = evnet.target.value.split(",")
    let distict = event2[0];
    let index = event2[1];
    if (type === 'taxInvoice') {
      this.province3[2] = this.subDistict3[index][0]
      this.post3 = this.subDistict3[index][1];
    }
    else {
      this.province[2] = this.subDistict[index][0]
      this.post = this.subDistict[index][1];

    }
    console.log(this.province[2], this.post);

  }




  selectProvince2(evnet) {
    let event2 = evnet.target.value.split(",")
    let distict = event2[0];
    let index = event2[1];
    this.province2[0] = this.products[index][0];
    this.distict2 = this.products[index][1];
    console.log(this.distict2);
  }

  selectDistict2(evnet) {
    // console.log(evnet.target.value.split(","));
    let event2 = evnet.target.value.split(",")
    let distict = event2[0];
    let index = event2[1];
    this.province2[1] = this.distict2[index][0]
    this.subDistict2 = this.distict2[index][1];
    console.log(this.province2[1], this.subDistict2);
  }

  selectSubDistict2(evnet) {
    // console.log(evnet.target.value.split(","));
    let event2 = evnet.target.value.split(",")
    let distict = event2[0];
    let index = event2[1];
    this.province2[2] = this.subDistict2[index][0]
    this.post2 = this.subDistict2[index][1];
    console.log(this.province2[2], this.post2);
  }


  openMap() {
    this.checkMap = !this.checkMap
    console.log('checkMap', this.checkMap);
  }
  // openMap(map) {
  //   this.modalService.open(map);
  // }

  test() {

    // console.log('data', event.target.value);
    this.checkBoxAddJob = !this.checkBoxAddJob
    console.log('111', this.checkBoxAddJob);


  }

  saveLongLat() {
    this.longitude11 = this.longitude
    this.latitude11 = this.latitude
    this.checkLonglat = true;
  }
  saveLongLat22() {
    this.longitude22 = this.longitude2
    this.latitude22 = this.latitude2
    this.checkLongLat2 = true;
  }


}
