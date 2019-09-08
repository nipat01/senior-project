import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddWikiComponent } from '../add-wiki/add-wiki.component';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // wikiList: Observable<any>;
  wiki: any = {};
  wikis: any = []
  // wikis: { key: string; value: unknown; }[];




  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;


  wikiForm = new FormGroup({
    imageUrl: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    addressLat: new FormControl('', Validators.required),
    addressLong: new FormControl('', Validators.required),
    currentLat: new FormControl('', Validators.required),
    currentLong: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    lineId: new FormControl('', Validators.required),
    citizenId: new FormControl('', Validators.required),
    phoneId: new FormControl('', Validators.required),
    hireDate: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),

  });
  editwikiForm = new FormGroup({
    email: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    addressLat: new FormControl('', Validators.required),
    addressLong: new FormControl('', Validators.required),
    currentLat: new FormControl('', Validators.required),
    currentLong: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    lineId: new FormControl('', Validators.required),
    citizenId: new FormControl('', Validators.required),
    phoneId: new FormControl('', Validators.required),
    hireDate: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),

  });

  constructor(
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private router: Router,
    private modalService: NgbModal,
    private auth: AuthService,
  ) { }
  // constructor(private db: AngularFireDatabase, private router: Router) {}
  ngOnInit() {

    this.db.list('wikis').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis;

    });

    this.starForm();
  }

  open(content) {
    const modalRef = this.modalService.open(content);

  }
  openData(contentData) {
    const modalRef = this.modalService.open(contentData);

  }
  openEditData(contentEditData) {
    const modalRef = this.modalService.open(contentEditData);

  }
  onSubmit() {
    console.log('onSubmit working');

  }
  resetPassword(data) {
    this.auth.resetPassword(data.value.email)
  }
  deleteAccount(data2) {
    this.auth.deleteAccount(data2.value.email)
  }

  editWiki(editwikiForm, data) {
    // this.router.navigate([`/editWiki/${data.key}`]);
    console.log('updateWikis:', data.key, editwikiForm.value);
    this.firebaseService.editWiki(data.key, editwikiForm.value);
  }
  getCurentAddress() {
    this.wikis;
    console.log(this.wikis.length);
    // console.log(getDataWikis[0].key);
    for (let i = 0; i < this.wikis.length; i++) {
      console.log('test')
      const setCurrentWikis = {
        ...this.wikis[i],
      }
      let setCurrent = setCurrentWikis.value
      let setCur2 = {
        ...setCurrent,
        currentLat: '1.1.1.1',
        currentLong: '1.1.1.1',
      }
      console.log('setCurrent', setCurrent);
      console.log('setCur2', setCur2);


      // console.log('setCurrentWikis', setCurrentWikis);
      // console.log('showValue', this.wikis[i].key,);

      this.firebaseService.editWiki(this.wikis[i].key, setCur2);
    }

  }

  delWiki(data) {
    this.firebaseService.removeWiki(data.key);
  }
  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      // this.imgSrc = '/assets/img/image_placeholder.jpg';
      // this.selectedImage = null;
    }
  }
  starForm() {
    this.imgSrc = '/assets/img/image_placeholder.jpg';

    // this.selectedImage = null;
    // this.selectedImage2 = null;
    // this.isSubmitted = false;
  }

}



// import { Component, OnInit } from '@angular/core';
// import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { Router } from '@angular/router';
// import { Action } from 'rxjs/internal/scheduler/Action';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements OnInit {
//   wikiList: AngularFireList<any>;
//   wikis: any[];
//   constructor(private db: AngularFireDatabase, private router: Router) {
//     this.wikiList = db.list('wikis');
//   }
//   ngOnInit() {
//     this.wikiList.snapshotChanges().map(actions => {
//       return actions.map(action => ({key: action.payload, value: action.payload.val() }));
//     }).subscribe(wikis => {
//       console.log(wikis)
//       this.wikis = wikis;

//     });
//   }



//   editWiki(data) {
//     this.router.navigate([`/editWiki/${data.key}`]);
//   }
//   delWiki(data) {
//     this.wikiList.remove(data.key);
//   }
// }
