import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {
  getUser: any[];
  wikis: any[];
  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private auth: AuthService) { }

  ngOnInit() {
    // this.firebaseService.getUser(this.auth.username());

    // this.db.list('/wikis', ref => ref.child('email').equalTo(this.auth.username)
    // .snapshotChanges().subscribe((user) =>{
    //   this.user = user;
    // });


    this.db.list('wikis').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(this.auth.username);
      this.wikis = wikis.filter((data: any) => data.value.email === this.auth.username)

    });

  }

}