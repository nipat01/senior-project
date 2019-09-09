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
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  wikis: any[];

  editPasswordForm = new FormGroup({

    password: new FormControl('', Validators.required),


  });

  constructor(
    private db: AngularFireDatabase,
    private router: Router,
    private auth: AuthService,
    private modalService: NgbModal
  ) { }
  ngOnInit() {
    // this.db.list('wikis').snapshotChanges().map(actions => {
    //   return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    // }).subscribe(wikis => {
    //   console.log(this.auth.username);
    //   this.wikis = wikis.filter((data: any) => data.value.email === this.auth.username)
    // });

  }
  openEditData(contentEditData) {
    const modalRef = this.modalService.open(contentEditData);

  }
  editPassword(editPasswordForm) {
    console.log('editpassword working');
    this.auth.updatePassword(editPasswordForm.value.password);

  }
}
