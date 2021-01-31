import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { MapsAPILoader, MouseEvent } from '@agm/core'; //ทำให้สามารถใช้งาน $event.coords.longlat ได้

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnChanges {

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }


  about: any[];
  account: any[];
  location: any[];
  longitude: number;
  latitude: number;
  longitude2: number;
  latitude2: number;
  zoom: number;



  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  // constructor() { }
  constructor(
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private mapsAPILoader: MapsAPILoader,


  ) { }
  ngOnInit() {
    this.zoom = 18;
    this.setCurrentLocation();
    this.db.list('allhomepage/about').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(about => {
      console.log(about)
      this.about = about;

    });

    this.db.list('allhomepage/lineAccount').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(account => {
      console.log(account)
      this.account = account;

    });
    this.db.list('allhomepage/location').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(location => {
      // console.log('location', location)
      this.location = location;
      console.log('location', this.location);
      if (!this.location[0].value) {
        this.location[0].value.lat = this.latitude;
        this.location[0].value.long = this.longitude;
        console.log('thisLoc', this.location[0]);


      }
    });
  }

  addAbout(data) {
    console.log(this.db.list('allhomepage/about').snapshotChanges().subscribe());
    console.log(this.about);
    if (this.about.length === 0) {
      this.db.list("allhomepage/about").push(data.value);
    } else {
      console.log('updating');
      console.log(this.about[0].key);
      const key = this.about[0].key;
      this.firebaseService.editAbout(key, data.value);
    }
  }

  addLineAccount(data) {
    console.log('test');
    // console.log(this.db.list('allhomepag/lineAccount').snapshotChanges().subscribe());
    console.log(this.account);
    if (this.account.length === 0) {
      this.db.list('allhomepage/lineAccount').push(data.value);
    } else {
      console.log('updating1');
      console.log(this.account[0].key);
      const key = this.account[0].key;
      this.firebaseService.editAccount(key, data.value);
    }
  }

  lacationOnAboutUs() {
    console.log('555');
    //ไม่ใช้
    // for (let i = 0; i < this.location.length; i++) {
    //   const setCurrentWikis = {
    //     ...this.location[i],
    //   }
    //   let setCurrent = setCurrentWikis.value
    //   let setCur2 = {
    //     ...setCurrent,
    //     currentLat: '',
    //     currentLong: '',
    //   }
    //   console.log('setCurrent', setCurrent);
    //   console.log('setCur2', setCur2);
    // }

    this.location[0].value.lat = this.latitude;
    this.location[0].value.long = this.longitude;
    //ใช้งาน
    // if (this.location.length === 0) {
    //   const dataLocation = {
    //     lat: this.latitude,
    //     long: this.longitude,
    //   }


    //   console.log('success send locattiton');

    //   this.db.list('allhomepage/location').push(dataLocation);
    // }
    // else {
    //   console.log('location[0]', this.location[0]);
    //   console.log('length', this.location.length);
    //   let dataLocation = {
    //     ...this.location[0].value,
    //   }
    //   let updateLocation = {
    //     ...dataLocation,
    //     lat: this.latitude,
    //     long: this.longitude,
    //   }

    //   console.log('updateLocation', updateLocation);
    //   this.firebaseService.editLocationOnAboutUs(this.location[0].key, updateLocation);
    // }
  }

  locationAddresstion() {
    if (this.location.length === 0) {
      const dataLocation = {
        lat: this.latitude2,
        long: this.longitude2,
      }


      console.log('success send locattiton');

      this.db.list('allhomepage/location').push(dataLocation);
    }
    else {
      console.log('location[0]', this.location[0]);
      console.log('length', this.location.length);
      let dataLocation = {
        ...this.location[0].value,
      }
      let updateLocation = {
        ...dataLocation,
        lat: this.latitude2,
        long: this.longitude2,
      }

      console.log('updateLocation2', updateLocation);
      this.firebaseService.editLocationOnAboutUs(this.location[0].key, updateLocation);
    }

  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 18;
        console.log('lat,long', this.latitude, this.longitude);

        // this.getAddress(this.latitude, this.longitude);
      });
    }
  };

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude2 = $event.coords.lat;
    this.longitude2 = $event.coords.lng;
    // this.getAddress(this.latitude, this.longitude);
    console.log(this.latitude2, this.longitude2);
    // window.alert('Geocoder failed due to: ');
  }

  openCurrentAddress(contentCurrent) {
    const modalRef = this.modalService.open(contentCurrent);
  }

}
