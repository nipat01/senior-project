import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  about: any[];
  account: any[];
  // constructor() { }
  constructor(
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }
  ngOnInit() {
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
}
