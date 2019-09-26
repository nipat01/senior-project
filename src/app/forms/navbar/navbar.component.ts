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


import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase-service.service';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnChanges {
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('navbar', changes.color.currentValue);
    const nav = document.querySelector('nav');
    // nav.classList.replace('bg-header', 'warning');
    console.log(nav.className)
  }

  // static COLOR = '';
  // static DEFAULTCOLOR = '#abc';
  public isCollapsed = true;
  selectedColor: string;
  wikis: any[];
  token: any[];
  pickerColor: any[];
  editPasswordForm = new FormGroup({
    password: new FormControl('', Validators.required),
  });

  tokenForm = new FormGroup({
    tokenAdmin: new FormControl(),
    tokenGroup: new FormControl(),
  });

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  constructor(
    private db: AngularFireDatabase,
    private router: Router,
    public auth: AuthService,
    // private auth: AuthService,
    private modalService: NgbModal,
    private firebaseService: FirebaseService
  ) { }
  ngOnInit() {
    console.log('navbar', this.color);
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

    this.db.list('allhomepage/pickerColor').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(pickerColor => {
      console.log('pickerColor', pickerColor[0].value)
      this.pickerColor = pickerColor;
      console.log('thispicker', this.pickerColor[0].value.color);
      AppComponent.COLOR = this.pickerColor[0].value.color;

    });


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
  changesColor() {
    console.log(this.selectedColor);
    AppComponent.COLOR = this.selectedColor;
    console.log(AppComponent.COLOR);
    let pickerColorObj = {
      color: AppComponent.COLOR
    }
    console.log();
    if (this.pickerColor.length === 0) {
      this.db.list('allhomepage/pickerColor').push(pickerColorObj);
    } else {
      console.log('updating pickerColor');
      console.log(this.pickerColor[0].key);
      const key = this.pickerColor[0].key;
      this.firebaseService.editpickerColor(key, pickerColorObj);
    }
  }

}
