import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LineNotifyService } from 'src/app/services/line-notify.service';
import * as cors from 'cors';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-addjob',
  templateUrl: './addjob.component.html',
  styleUrls: ['./addjob.component.css']
})

export class AddjobComponent implements OnInit {

  //map-----------------------------------------------------------------------------------------------
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;
  //addJob
  token;
  constructor(private db: AngularFireDatabase,
    private lineNotify: LineNotifyService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit() {
    //map--------------------------------------------------------------------------------------------
    // this.setCurrentLocation();
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
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
    console.log('addJob Token', this.token[0].value.tokenAdmin);

    console.log(data.value);
    let time = new Date();
    const jobData = {
      ...data.value,
      status: 'checkdata',
      driver: '',
      totalPayment: '',
      deposit: '',
      bill: '',
      billNo: '',
      billImageUrl: '',
      billNoImageUrl: '',
      token: this.token[0].value.tokenAdmin,
      // review: time.getTime(),

    }
    // from(this.db.list("/job").push(jobData)).pipe(
    //   switchMap(() => {
    //     return this.lineNotify.postMessage('test');
    //   }),
    //   ).subscribe(result => console.log(result));
    this.db.list("/job").push(jobData)

    //
    // this.db.list("/job").push(data.value).child('status').set("waiting");

  }


  //map--------------------------------------------------------------------------------------------------
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 18;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  };

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  };

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }


}
