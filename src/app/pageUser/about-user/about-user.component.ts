import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about-user',
  templateUrl: './about-user.component.html',
  styleUrls: ['./about-user.component.css']
})
export class AboutUserComponent implements OnInit {
  about: any[];
  account: any[];
  location: any[];
  longitude: number;
  latitude: number;
  zoom: number;
  constructor(
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }
  ngOnInit() {
    this.zoom = 18;
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

}
