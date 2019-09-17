import { Component, OnInit, } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  about: any[];
  account: any[];
  location: any[];
  longitude: number;
  latitude: number;
  zoom: number;
  // constructor() { }
  constructor(
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
   
  ) { }
  ngOnInit() {

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
      console.log('location', location)
      this.location = location;
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

    if (this.location.length === 0) {
      const dataLocation = {
        lat: this.latitude,
        long: this.longitude,
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
        lat: this.latitude,
        long: this.longitude,
      }

      console.log('updateLocation', updateLocation);
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
  openCurrentAddress(contentCurrent) {
    const modalRef = this.modalService.open(contentCurrent);
  }

}
