// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// @Component({
//  selector: 'app-navbar',
//  templateUrl: './navbar.component.html',
//  styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent implements OnInit {
// constructor(
//  private router:Router,
//  private auth: AuthService
//  ) { }
// ngOnInit() {
//  }
// }


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase-service.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  wikis: any[];
  token: any[];

  editPasswordForm = new FormGroup({
    password: new FormControl('', Validators.required),
  });

  tokenForm = new FormGroup({
    tokenAdmin: new FormControl(),
    tokenGroup: new FormControl(),
  });

  constructor(
    private db: AngularFireDatabase,
    private router: Router,
    public auth: AuthService,
    // private auth: AuthService,
    private modalService: NgbModal,
    private firebaseService: FirebaseService
  ) { }
  ngOnInit() {
    // this.db.list('wikis').snapshotChanges().map(actions => {
    //   return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    // }).subscribe(wikis => {
    //   console.log(this.auth.username);
    //   this.wikis = wikis.filter((data: any) => data.value.email === this.auth.username)
    // });


    this.db.list('token').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(token => {
      console.log('token', token[0].value)
      this.token = token;
    });

    // this.db.list('token').snapshotChanges().subscribe(
    //   list => {
    //     this.token = list.map(item => ({ key: item.key, value: item.payload.val() }));
    //     console.log('token', this.token[0].value.tokenAdmin, 'length', this.token.length);
    //   });
  }

  openEditData(contentEditData) {
    const modalRef = this.modalService.open(contentEditData);
  }

  openToken(contentEditData) {
    const modalRef = this.modalService.open(contentEditData);
  }

  editPassword(editPasswordForm) {
    console.log('editpassword working');
    this.auth.updatePassword(editPasswordForm.value.password);
  }

  addToken(data) {
    console.log(data.value);
    // // console.log(this.db.list('allhomepag/lineAccount').snapshotChanges().subscribe());
    // console.log(this.account);
    if (this.token.length === 0) {
      this.db.list('token').push(data.value);
    } else {
      console.log('updateToken', this.token[0].key);
      const key = this.token[0].key;
      this.firebaseService.editToken(key, data.value);
      // }
    }
  }


}
